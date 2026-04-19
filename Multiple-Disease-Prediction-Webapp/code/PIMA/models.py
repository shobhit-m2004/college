from sklearn.ensemble import (
    ExtraTreesClassifier,
    GradientBoostingClassifier,
    HistGradientBoostingClassifier,
    RandomForestClassifier,
)
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

try:
    from xgboost import XGBClassifier
except Exception:  # pragma: no cover - optional dependency in some environments
    XGBClassifier = None


def model_factory(use_gpu=False, random_state=42, scale_pos_weight=1.0):
    """
    Build model candidates while keeping the original multi-model strategy.

    Args:
        use_gpu: Enable GPU tree method for XGBoost when available.
        random_state: Reproducibility seed.
        scale_pos_weight: Imbalance weight for XGBoost.
    """
    models = {
        "LogisticRegression": LogisticRegression(
            max_iter=4000,
            class_weight="balanced",
            random_state=random_state,
        ),
        "RandomForest": RandomForestClassifier(
            n_estimators=400,
            class_weight="balanced",
            random_state=random_state,
            n_jobs=-1,
        ),
        "ExtraTrees": ExtraTreesClassifier(
            n_estimators=400,
            class_weight="balanced",
            random_state=random_state,
            n_jobs=-1,
        ),
        "HistGB": HistGradientBoostingClassifier(
            max_iter=350,
            learning_rate=0.05,
            random_state=random_state,
        ),
        "GradientBoosting": GradientBoostingClassifier(
            n_estimators=300,
            learning_rate=0.05,
            random_state=random_state,
        ),
        "SVC": SVC(
            probability=True,
            class_weight="balanced",
            kernel="rbf",
            random_state=random_state,
        ),
        "KNN": KNeighborsClassifier(n_neighbors=7),
        "GaussianNB": GaussianNB(),
        "DecisionTree": DecisionTreeClassifier(
            class_weight="balanced",
            random_state=random_state,
        ),
    }

    if XGBClassifier is not None:
        xgb_params = {
            "n_estimators": 350,
            "learning_rate": 0.05,
            "max_depth": 4,
            "subsample": 0.9,
            "colsample_bytree": 0.9,
            "random_state": random_state,
            "n_jobs": 1,
            "eval_metric": "logloss",
            "scale_pos_weight": float(max(scale_pos_weight, 1.0)),
        }
        if use_gpu:
            xgb_params["tree_method"] = "gpu_hist"
        models["XGBoost"] = XGBClassifier(**xgb_params)

    return models
