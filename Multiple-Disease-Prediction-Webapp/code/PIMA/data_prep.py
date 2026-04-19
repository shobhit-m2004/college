import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


class OutlierClipper(BaseEstimator, TransformerMixin):
    """Clip numeric features to robust percentile bounds to reduce outlier impact."""

    def __init__(self, lower_q=1.0, upper_q=99.0):
        self.lower_q = lower_q
        self.upper_q = upper_q
        self.lower_bounds_ = None
        self.upper_bounds_ = None

    def fit(self, X, y=None):
        X_arr = np.asarray(X, dtype=float)
        self.lower_bounds_ = np.nanpercentile(X_arr, self.lower_q, axis=0)
        self.upper_bounds_ = np.nanpercentile(X_arr, self.upper_q, axis=0)
        return self

    def transform(self, X):
        X_arr = np.asarray(X, dtype=float)
        return np.clip(X_arr, self.lower_bounds_, self.upper_bounds_)


class KFoldTargetEncoder(BaseEstimator, TransformerMixin):
    """
    Backward-compatible target encoder utility.
    Kept for compatibility with older code paths.
    """

    def __init__(self, cols=None, n_splits=5, smoothing=1.0, random_state=42):
        self.cols = cols or []
        self.n_splits = n_splits
        self.smoothing = smoothing
        self.random_state = random_state
        self.global_mean_ = None
        self.maps_ = {}

    def fit(self, X, y):
        X = X.reset_index(drop=True)
        y = pd.Series(y).reset_index(drop=True)
        self.global_mean_ = y.mean()
        for col in self.cols:
            tmp = pd.concat([X[col].astype(str), y], axis=1)
            grp = tmp.groupby(col)[y.name if hasattr(y, "name") else 0].agg(["mean", "count"])
            self.maps_[col] = grp.to_dict(orient="index")
        return self

    def transform(self, X, y=None):
        X = X.copy().reset_index(drop=True)
        for col in self.cols:
            def _encode(value):
                key = str(value)
                if key not in self.maps_.get(col, {}):
                    return self.global_mean_
                stats = self.maps_[col][key]
                mean_val = stats["mean"]
                count_val = stats["count"]
                return (mean_val * count_val + self.global_mean_ * self.smoothing) / (count_val + self.smoothing)

            X[f"{col}_te"] = X[col].map(_encode).fillna(self.global_mean_)
        return X


def split_feature_types(df):
    """Return numeric and categorical column lists from a DataFrame."""
    num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    cat_cols = [col for col in df.columns if col not in num_cols]
    return num_cols, cat_cols


def build_preprocessor(df, lower_q=1.0, upper_q=99.0):
    """Build a sklearn preprocessor with imputation + outlier clipping + scaling."""
    num_cols, cat_cols = split_feature_types(df)

    num_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("clipper", OutlierClipper(lower_q=lower_q, upper_q=upper_q)),
            ("scaler", StandardScaler()),
        ]
    )

    transformers = [("num", num_pipeline, num_cols)]

    if cat_cols:
        cat_pipeline = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="most_frequent")),
                (
                    "onehot",
                    OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                ),
            ]
        )
        transformers.append(("cat", cat_pipeline, cat_cols))

    preprocessor = ColumnTransformer(transformers=transformers, remainder="drop")
    return preprocessor, num_cols, cat_cols


def preprocess_numeric(X_train_df, X_hold_df):
    """
    Legacy utility kept for backward compatibility with previous training code.
    New pipeline should prefer build_preprocessor().
    """
    num_cols = X_train_df.select_dtypes(include=[np.number]).columns.tolist()
    imputer = SimpleImputer(strategy="median")
    scaler = StandardScaler()
    X_train_num = pd.DataFrame(
        imputer.fit_transform(X_train_df[num_cols]),
        columns=num_cols,
        index=X_train_df.index,
    )
    X_train_num = pd.DataFrame(
        scaler.fit_transform(X_train_num),
        columns=num_cols,
        index=X_train_df.index,
    )
    X_hold_num = pd.DataFrame(
        imputer.transform(X_hold_df[num_cols]),
        columns=num_cols,
        index=X_hold_df.index,
    )
    X_hold_num = pd.DataFrame(
        scaler.transform(X_hold_num),
        columns=num_cols,
        index=X_hold_df.index,
    )
    return X_train_num, X_hold_num, imputer, scaler, num_cols


def minority_class_ratio(y):
    """Return minority/majority class ratio for binary target."""
    counts = pd.Series(y).value_counts()
    if counts.empty or counts.max() == 0:
        return 1.0
    return float(counts.min() / counts.max())
