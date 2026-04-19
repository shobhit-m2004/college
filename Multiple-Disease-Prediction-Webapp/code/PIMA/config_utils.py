import yaml
from pathlib import Path

DEFAULTS = {
    "data_path": "pima_diabetes.csv",
    "target": "Outcome",
    "test_size": 0.2,
    "random_state": 42,
    "cv_folds": 5,
    "nested_cv_folds": 3,
    "top_n": 3,
    "n_trials": 20,
    "artifact_dir": "artifacts",
    "use_gpu": False,
    "save_pickle": True,
    "report_pdf_name": "pima_diabetes_report.pdf",
    "n_jobs": 1,
    "models": [],
    "smote_ratio_trigger": 0.75,
    "outlier_lower_q": 1.0,
    "outlier_upper_q": 99.0,
    "feature_importance_top_n": 15,
    "enable_shap": True,
    "shap_background_size": 120,
    "shap_top_n": 10,
    "fairness_columns": ["Gender", "gender", "Sex", "sex"],
}


def load_config(path):
    with open(path, "r", encoding="utf-8") as fh:
        user_cfg = yaml.safe_load(fh) or {}

    cfg = DEFAULTS.copy()
    cfg.update(user_cfg)

    # Empty models list means "use all available models".
    if not cfg.get("models"):
        cfg["models"] = []

    Path(cfg["artifact_dir"]).mkdir(parents=True, exist_ok=True)
    return cfg
