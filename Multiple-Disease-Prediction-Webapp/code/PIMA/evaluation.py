import io
import logging
from typing import Dict, List, Optional, Tuple

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
try:
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.utils import ImageReader
    from reportlab.pdfgen import canvas
    REPORTLAB_AVAILABLE = True
except Exception:
    REPORTLAB_AVAILABLE = False
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_recall_curve,
    precision_score,
    recall_score,
    roc_auc_score,
    roc_curve,
)

logger = logging.getLogger(__name__)


def risk_category(probability: float) -> str:
    """Map probability to interpretable risk bucket."""
    if probability < 0.30:
        return "Low Risk"
    if probability < 0.70:
        return "Medium Risk"
    return "High Risk"


def classify_with_threshold(probabilities: np.ndarray, threshold: float) -> np.ndarray:
    """Convert positive-class probabilities into binary predictions."""
    probs = np.asarray(probabilities, dtype=float)
    return (probs >= float(threshold)).astype(int)


def compute_binary_metrics(y_true, y_pred, y_prob) -> Dict[str, float]:
    """Compute core binary classification metrics for production reporting."""
    metrics = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, zero_division=0)),
        "f1": float(f1_score(y_true, y_pred, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_true, y_prob)),
    }
    cm = confusion_matrix(y_true, y_pred)
    metrics["tn"] = int(cm[0, 0])
    metrics["fp"] = int(cm[0, 1])
    metrics["fn"] = int(cm[1, 0])
    metrics["tp"] = int(cm[1, 1])
    return metrics


def tune_threshold(
    y_true,
    y_prob,
    min_threshold: float = 0.05,
    max_threshold: float = 0.95,
    step: float = 0.01,
) -> Tuple[float, List[Dict[str, float]]]:
    """
    Tune threshold by maximizing F1 on probability scores.

    Returns:
        best_threshold, threshold_scan_rows
    """
    y_true_arr = np.asarray(y_true)
    y_prob_arr = np.asarray(y_prob, dtype=float)

    scan = []
    best_threshold = 0.50
    best_f1 = -1.0

    thresholds = np.arange(min_threshold, max_threshold + step, step)
    for threshold in thresholds:
        y_pred = classify_with_threshold(y_prob_arr, threshold)
        precision = precision_score(y_true_arr, y_pred, zero_division=0)
        recall = recall_score(y_true_arr, y_pred, zero_division=0)
        f1_val = f1_score(y_true_arr, y_pred, zero_division=0)

        row = {
            "threshold": float(threshold),
            "precision": float(precision),
            "recall": float(recall),
            "f1": float(f1_val),
        }
        scan.append(row)

        if (f1_val > best_f1) or (np.isclose(f1_val, best_f1) and threshold > best_threshold):
            best_f1 = f1_val
            best_threshold = threshold

    return float(best_threshold), scan


def compute_fairness_by_group(y_true, y_pred, y_prob, groups) -> Dict[str, Dict[str, float]]:
    """
    Basic fairness diagnostic: per-group metrics for available sensitive feature.
    """
    group_series = np.asarray(groups)
    out: Dict[str, Dict[str, float]] = {}

    for group_val in pd_unique_sorted(group_series):
        mask = group_series == group_val
        if mask.sum() == 0:
            continue
        group_metrics = compute_binary_metrics(
            np.asarray(y_true)[mask],
            np.asarray(y_pred)[mask],
            np.asarray(y_prob)[mask],
        )
        out[str(group_val)] = group_metrics

    if len(out) >= 2:
        recalls = [item["recall"] for item in out.values()]
        out["fairness_summary"] = {
            "recall_gap_max": float(max(recalls) - min(recalls))
        }

    return out


def pd_unique_sorted(values: np.ndarray) -> List[object]:
    """Return deterministic unique values while preserving original value types."""
    unique_values = list(dict.fromkeys(values.tolist()))
    return sorted(unique_values, key=lambda item: str(item))


def extract_feature_importance(fitted_pipeline, top_n: int = 15) -> List[Dict[str, float]]:
    """Extract model feature importance from feature_importances_ or coef_."""
    model = fitted_pipeline.named_steps["model"]
    preprocessor = fitted_pipeline.named_steps["preprocess"]

    try:
        feature_names = preprocessor.get_feature_names_out().tolist()
    except Exception:
        feature_names = [f"feature_{idx}" for idx in range(getattr(model, "n_features_in_", 0))]

    importances = None
    if hasattr(model, "feature_importances_"):
        importances = np.asarray(model.feature_importances_, dtype=float)
    elif hasattr(model, "coef_"):
        coef = np.asarray(model.coef_, dtype=float)
        importances = np.abs(coef[0] if coef.ndim > 1 else coef)

    if importances is None or importances.size == 0:
        return []

    top_idx = np.argsort(importances)[::-1][:top_n]
    output = []
    for idx in top_idx:
        if idx >= len(feature_names):
            continue
        output.append(
            {
                "feature": str(feature_names[idx]),
                "importance": float(importances[idx]),
            }
        )
    return output


def explain_prediction_with_shap(
    fitted_pipeline,
    background_df,
    sample_df,
    top_n: int = 10,
) -> Dict[str, object]:
    """
    Compute SHAP explanation for one prediction with graceful fallback.
    """
    try:
        import shap
    except Exception as exc:
        return {
            "available": False,
            "message": f"SHAP unavailable: {exc}",
            "top_features": [],
        }

    try:
        preprocessor = fitted_pipeline.named_steps["preprocess"]
        model = fitted_pipeline.named_steps["model"]

        X_bg = preprocessor.transform(background_df)
        X_sample = preprocessor.transform(sample_df)

        if hasattr(X_bg, "toarray"):
            X_bg = X_bg.toarray()
        if hasattr(X_sample, "toarray"):
            X_sample = X_sample.toarray()

        try:
            feature_names = preprocessor.get_feature_names_out().tolist()
        except Exception:
            feature_names = [f"feature_{idx}" for idx in range(X_sample.shape[1])]

        bg = X_bg[: min(150, X_bg.shape[0])]
        explainer = shap.Explainer(model, bg)
        shap_values = explainer(X_sample)

        values = shap_values.values
        if values.ndim == 3:
            row_values = values[0, :, 1]
        else:
            row_values = values[0]

        top_idx = np.argsort(np.abs(row_values))[::-1][:top_n]
        top_rows = []
        for idx in top_idx:
            top_rows.append(
                {
                    "feature": str(feature_names[idx]),
                    "shap_value": float(row_values[idx]),
                    "feature_value": float(X_sample[0, idx]),
                }
            )

        return {
            "available": True,
            "message": "ok",
            "top_features": top_rows,
        }
    except Exception as exc:
        logger.warning("SHAP explanation failed: %s", exc)
        return {
            "available": False,
            "message": f"SHAP explanation failed: {exc}",
            "top_features": [],
        }


def plot_confusion(y_true, y_pred, title="Confusion Matrix"):
    cm = confusion_matrix(y_true, y_pred)
    fig, ax = plt.subplots(figsize=(4.5, 4))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", ax=ax)
    ax.set_xlabel("Predicted")
    ax.set_ylabel("Actual")
    ax.set_title(title)
    return fig


def plot_roc(y_true, y_prob, title="ROC Curve"):
    fpr, tpr, _ = roc_curve(y_true, y_prob)
    auc_val = roc_auc_score(y_true, y_prob)
    fig, ax = plt.subplots(figsize=(5, 4))
    ax.plot(fpr, tpr, label=f"AUC={auc_val:.3f}")
    ax.plot([0, 1], [0, 1], "k--")
    ax.set_xlabel("False Positive Rate")
    ax.set_ylabel("True Positive Rate")
    ax.set_title(title)
    ax.legend(loc="lower right")
    return fig


def plot_model_cv(cv_summary: Dict[str, Dict[str, float]]):
    names = list(cv_summary.keys())
    vals = [cv_summary[name]["roc_auc_mean"] for name in names]
    fig, ax = plt.subplots(figsize=(8, 4))
    sns.barplot(x=vals, y=names, orient="h", ax=ax)
    ax.set_xlabel("Cross-Validation ROC-AUC")
    ax.set_title("Model Comparison")
    return fig


def plot_feature_importance(feature_rows: List[Dict[str, float]]):
    if not feature_rows:
        return None
    labels = [row["feature"] for row in feature_rows]
    vals = [row["importance"] for row in feature_rows]
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.barplot(x=vals, y=labels, orient="h", ax=ax)
    ax.set_xlabel("Importance")
    ax.set_title("Top Feature Importance")
    return fig


def save_fig_to_bytes(fig):
    buf = io.BytesIO()
    fig.tight_layout()
    fig.savefig(buf, format="png", dpi=140)
    plt.close(fig)
    buf.seek(0)
    return buf


def generate_report(
    pdf_path: str,
    cv_summary: Dict[str, Dict[str, float]],
    test_metrics: Dict[str, float],
    tuned_threshold: float,
    y_test,
    y_pred,
    y_prob,
    feature_importance: Optional[List[Dict[str, float]]] = None,
    fairness_report: Optional[Dict[str, Dict[str, float]]] = None,
):
    """Generate compact PDF report with metrics and diagnostic plots."""
    if not REPORTLAB_AVAILABLE:
        logger.warning("reportlab is not installed; skipping PDF report generation.")
        return
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica-Bold", 14)
    c.drawString(45, height - 45, "Diabetes Model Report")

    c.setFont("Helvetica", 10)
    c.drawString(45, height - 65, f"Tuned threshold: {tuned_threshold:.2f}")
    c.drawString(
        45,
        height - 80,
        (
            f"Acc: {test_metrics['accuracy']:.3f}  Prec: {test_metrics['precision']:.3f}  "
            f"Rec: {test_metrics['recall']:.3f}  F1: {test_metrics['f1']:.3f}  "
            f"ROC-AUC: {test_metrics['roc_auc']:.3f}"
        ),
    )

    y_pos = height - 105
    c.setFont("Helvetica-Bold", 11)
    c.drawString(45, y_pos, "Cross-Validation Summary")
    y_pos -= 14
    c.setFont("Helvetica", 9)
    for model_name, row in sorted(cv_summary.items(), key=lambda item: item[1]["roc_auc_mean"], reverse=True):
        c.drawString(
            55,
            y_pos,
            (
                f"{model_name}: AUC={row['roc_auc_mean']:.3f} +/- {row['roc_auc_std']:.3f}, "
                f"F1={row['f1_mean']:.3f}, Precision={row['precision_mean']:.3f}, Recall={row['recall_mean']:.3f}"
            ),
        )
        y_pos -= 12
        if y_pos < 120:
            c.showPage()
            y_pos = height - 45

    figs = [
        plot_model_cv(cv_summary),
        plot_confusion(y_test, y_pred, title="Confusion Matrix (Test)"),
        plot_roc(y_test, y_prob, title="ROC Curve (Test)"),
    ]

    fi_fig = plot_feature_importance(feature_importance or [])
    if fi_fig is not None:
        figs.append(fi_fig)

    c.showPage()
    y_img = height - 40
    for fig in figs:
        img_buf = save_fig_to_bytes(fig)
        img = ImageReader(img_buf)
        c.drawImage(img, 45, y_img - 210, width=520, height=200)
        y_img -= 220
        if y_img < 220:
            c.showPage()
            y_img = height - 40

    if fairness_report:
        c.showPage()
        c.setFont("Helvetica-Bold", 12)
        c.drawString(45, height - 45, "Fairness Slice Metrics")
        c.setFont("Helvetica", 9)
        y_pos = height - 70
        for group_name, values in fairness_report.items():
            c.drawString(50, y_pos, f"{group_name}: {values}")
            y_pos -= 13
            if y_pos < 50:
                c.showPage()
                y_pos = height - 45

    c.save()
