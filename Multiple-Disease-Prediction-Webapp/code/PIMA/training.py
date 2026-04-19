import json
import logging
import os
import pickle
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
try:
    from imblearn.over_sampling import SMOTE
    from imblearn.pipeline import Pipeline as ImbPipeline
    IMBLEARN_AVAILABLE = True
except Exception:
    from sklearn.pipeline import Pipeline as ImbPipeline
    SMOTE = None
    IMBLEARN_AVAILABLE = False
from sklearn.model_selection import (
    StratifiedKFold,
    cross_val_predict,
    cross_validate,
    train_test_split,
)

from data_prep import build_preprocessor, minority_class_ratio
from evaluation import (
    classify_with_threshold,
    compute_binary_metrics,
    compute_fairness_by_group,
    explain_prediction_with_shap,
    extract_feature_importance,
    generate_report,
    risk_category,
    tune_threshold,
)
from feature_engineer import feature_engineer
from models import model_factory


def _build_logger(artifact_dir: str) -> logging.Logger:
    logger = logging.getLogger("pima_pipeline")
    if logger.handlers:
        return logger

    logger.setLevel(logging.INFO)
    formatter = logging.Formatter("%(asctime)s | %(levelname)s | %(message)s")

    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)

    Path(artifact_dir).mkdir(parents=True, exist_ok=True)
    file_handler = logging.FileHandler(Path(artifact_dir) / "training.log", mode="w", encoding="utf-8")
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger


def _safe_predict_proba(model, X):
    if hasattr(model, "predict_proba"):
        return model.predict_proba(X)[:, 1]
    if hasattr(model, "decision_function"):
        raw = model.decision_function(X)
        raw = np.asarray(raw, dtype=float)
        return (raw - raw.min()) / (raw.max() - raw.min() + 1e-9)
    return model.predict(X).astype(float)


def _evaluate_model_cv(model_name, pipeline, X_train, y_train, cv, n_jobs, logger):
    scoring = {
        "roc_auc": "roc_auc",
        "precision": "precision",
        "recall": "recall",
        "f1": "f1",
        "accuracy": "accuracy",
    }

    try:
        cv_raw = cross_validate(
            pipeline,
            X_train,
            y_train,
            cv=cv,
            scoring=scoring,
            n_jobs=n_jobs,
            return_train_score=False,
            error_score="raise",
        )

        row = {
            "roc_auc_mean": float(np.mean(cv_raw["test_roc_auc"])),
            "roc_auc_std": float(np.std(cv_raw["test_roc_auc"])),
            "precision_mean": float(np.mean(cv_raw["test_precision"])),
            "recall_mean": float(np.mean(cv_raw["test_recall"])),
            "f1_mean": float(np.mean(cv_raw["test_f1"])),
            "accuracy_mean": float(np.mean(cv_raw["test_accuracy"])),
        }
        logger.info(
            "CV %-18s AUC=%.4f F1=%.4f Precision=%.4f Recall=%.4f",
            model_name,
            row["roc_auc_mean"],
            row["f1_mean"],
            row["precision_mean"],
            row["recall_mean"],
        )
        return row
    except Exception as exc:
        logger.warning("CV failed for %s: %s", model_name, exc)
        return None


def run_full_pipeline(cfg):
    artifact_dir = cfg["artifact_dir"]
    logger = _build_logger(artifact_dir)

    logger.info("Loading data from %s", cfg["data_path"])
    df = pd.read_csv(cfg["data_path"])
    if cfg["target"] not in df.columns:
        raise KeyError(f"Target column '{cfg['target']}' not found.")

    raw_input_columns = [col for col in df.columns if col != cfg["target"]]
    df = feature_engineer(df)
    X = df.drop(columns=[cfg["target"]])
    y = df[cfg["target"]].astype(int)
    pipeline_input_columns = list(X.columns)

    logger.info("Dataset shape after feature engineering: %s", df.shape)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=cfg["test_size"],
        stratify=y,
        random_state=cfg["random_state"],
    )

    preprocessor, num_cols, cat_cols = build_preprocessor(
        X_train,
        lower_q=cfg.get("outlier_lower_q", 1.0),
        upper_q=cfg.get("outlier_upper_q", 99.0),
    )
    logger.info("Numeric columns: %d | Categorical columns: %d", len(num_cols), len(cat_cols))

    imbalance_ratio = minority_class_ratio(y_train)
    use_smote = imbalance_ratio < cfg.get("smote_ratio_trigger", 0.75) and IMBLEARN_AVAILABLE
    if imbalance_ratio < cfg.get("smote_ratio_trigger", 0.75) and not IMBLEARN_AVAILABLE:
        logger.warning("SMOTE requested by imbalance ratio but imblearn is unavailable; using class-weight only fallback.")
    logger.info("Class imbalance ratio=%.4f | SMOTE enabled=%s", imbalance_ratio, use_smote)

    scale_pos_weight = 1.0 / max(imbalance_ratio, 1e-6)
    candidates = model_factory(
        use_gpu=cfg.get("use_gpu", False),
        random_state=cfg["random_state"],
        scale_pos_weight=scale_pos_weight,
    )

    keep_models = cfg.get("models")
    if keep_models:
        candidates = {name: model for name, model in candidates.items() if name in keep_models}
    if not candidates:
        raise RuntimeError("No models left to train. Check config 'models'.")

    cv = StratifiedKFold(
        n_splits=cfg["cv_folds"],
        shuffle=True,
        random_state=cfg["random_state"],
    )

    cv_summary = {}
    pipelines = {}
    n_jobs = int(cfg.get("n_jobs", 1))

    for model_name, model in candidates.items():
        steps = [("preprocess", preprocessor)]
        if use_smote and SMOTE is not None:
            steps.append(("smote", SMOTE(random_state=cfg["random_state"])))
        steps.append(("model", model))
        pipeline = ImbPipeline(steps=steps)

        row = _evaluate_model_cv(
            model_name,
            pipeline,
            X_train,
            y_train,
            cv=cv,
            n_jobs=n_jobs,
            logger=logger,
        )
        if row is not None:
            cv_summary[model_name] = row
            pipelines[model_name] = pipeline

    if not cv_summary:
        raise RuntimeError("All candidate models failed during cross-validation.")

    ranked_models = sorted(
        cv_summary.items(),
        key=lambda item: (item[1]["roc_auc_mean"], item[1]["f1_mean"]),
        reverse=True,
    )
    best_model_name = ranked_models[0][0]
    best_pipeline = pipelines[best_model_name]
    logger.info("Selected best model: %s", best_model_name)

    # Tune threshold from out-of-fold probabilities (train set)
    try:
        train_oof_proba = cross_val_predict(
            best_pipeline,
            X_train,
            y_train,
            cv=cv,
            method="predict_proba",
            n_jobs=1,
        )[:, 1]
        tuned_threshold, threshold_scan = tune_threshold(y_train, train_oof_proba)
        logger.info("Tuned threshold from OOF predictions: %.3f", tuned_threshold)
    except Exception as exc:
        logger.warning("Threshold tuning via OOF failed (%s). Falling back to 0.50", exc)
        tuned_threshold, threshold_scan = 0.50, []

    # Fit final model on full training split
    best_pipeline.fit(X_train, y_train)

    y_prob = _safe_predict_proba(best_pipeline, X_test)
    y_pred = classify_with_threshold(y_prob, tuned_threshold)
    test_metrics = compute_binary_metrics(y_test, y_pred, y_prob)

    logger.info(
        "Test metrics | AUC=%.4f F1=%.4f Precision=%.4f Recall=%.4f Accuracy=%.4f",
        test_metrics["roc_auc"],
        test_metrics["f1"],
        test_metrics["precision"],
        test_metrics["recall"],
        test_metrics["accuracy"],
    )

    fairness_report = None
    for fairness_col in cfg.get("fairness_columns", ["Gender", "gender", "Sex", "sex"]):
        if fairness_col in X_test.columns:
            fairness_report = {
                "feature": fairness_col,
                "groups": compute_fairness_by_group(y_test, y_pred, y_prob, X_test[fairness_col]),
            }
            logger.info("Fairness slice computed for column: %s", fairness_col)
            break

    feature_importance = extract_feature_importance(
        best_pipeline,
        top_n=cfg.get("feature_importance_top_n", 15),
    )

    shap_report = {
        "available": False,
        "message": "disabled",
        "top_features": [],
    }
    if cfg.get("enable_shap", True):
        background = X_train.sample(
            n=min(len(X_train), cfg.get("shap_background_size", 120)),
            random_state=cfg["random_state"],
        )
        sample = X_test.iloc[[0]]
        shap_report = explain_prediction_with_shap(
            best_pipeline,
            background_df=background,
            sample_df=sample,
            top_n=cfg.get("shap_top_n", 10),
        )

    # Save artifacts
    artifact_path = Path(artifact_dir)
    artifact_path.mkdir(parents=True, exist_ok=True)

    final_model_path = artifact_path / "final_model.joblib"
    preproc_path = artifact_path / "preproc.joblib"
    bundle_path = artifact_path / "inference_bundle.joblib"
    sav_path = artifact_path / "final_model.sav"

    joblib.dump(best_pipeline, final_model_path)
    joblib.dump(
        {
            "preprocessor": best_pipeline.named_steps.get("preprocess"),
            "input_columns": pipeline_input_columns,
            "raw_input_columns": raw_input_columns,
            "target": cfg["target"],
        },
        preproc_path,
    )

    inference_bundle = {
        "pipeline": best_pipeline,
        "threshold": float(tuned_threshold),
        "input_columns": raw_input_columns,
        "pipeline_input_columns": pipeline_input_columns,
        "target": cfg["target"],
        "best_model_name": best_model_name,
        "risk_buckets": {
            "low": [0.0, 0.30],
            "medium": [0.30, 0.70],
            "high": [0.70, 1.0],
        },
    }
    joblib.dump(inference_bundle, bundle_path)

    if cfg.get("save_pickle", True):
        with open(sav_path, "wb") as fh:
            pickle.dump(best_pipeline, fh)

    metrics_payload = {
        "selected_model": best_model_name,
        "threshold": float(tuned_threshold),
        "class_imbalance_ratio": float(imbalance_ratio),
        "cv_summary": cv_summary,
        "test_metrics": test_metrics,
        "confusion_matrix": {
            "tn": test_metrics["tn"],
            "fp": test_metrics["fp"],
            "fn": test_metrics["fn"],
            "tp": test_metrics["tp"],
        },
        "threshold_scan": threshold_scan,
        "feature_importance": feature_importance,
        "shap_explanation": shap_report,
        "fairness": fairness_report,
        "sample_prediction": {
            "probability": float(y_prob[0]),
            "probability_percent": float(y_prob[0] * 100.0),
            "risk_category": risk_category(float(y_prob[0])),
            "predicted_class": int(y_pred[0]),
        },
    }

    with open(artifact_path / "metrics.json", "w", encoding="utf-8") as fh:
        json.dump(metrics_payload, fh, indent=2)

    with open(artifact_path / "cv_scores.json", "w", encoding="utf-8") as fh:
        json.dump(cv_summary, fh, indent=2)

    generate_report(
        pdf_path=str(artifact_path / cfg.get("report_pdf_name", "model_report.pdf")),
        cv_summary=cv_summary,
        test_metrics=test_metrics,
        tuned_threshold=tuned_threshold,
        y_test=y_test,
        y_pred=y_pred,
        y_prob=y_prob,
        feature_importance=feature_importance,
        fairness_report=fairness_report["groups"] if fairness_report else None,
    )

    logger.info("Artifacts saved to %s", artifact_path.resolve())
    return str(artifact_path)
