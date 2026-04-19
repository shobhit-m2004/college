from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Sequence, Union

import joblib
import numpy as np
import pandas as pd

from evaluation import classify_with_threshold, risk_category
from feature_engineer import feature_engineer


class InputValidationError(ValueError):
    """Raised when incoming inference payload does not match expected schema."""


PayloadType = Union[Dict[str, Any], List[Dict[str, Any]], pd.DataFrame]


def validate_api_input(payload: PayloadType, expected_columns: Sequence[str]) -> pd.DataFrame:
    """Validate and normalize inbound API payload into a DataFrame."""
    if isinstance(payload, pd.DataFrame):
        df = payload.copy()
    elif isinstance(payload, dict):
        df = pd.DataFrame([payload])
    elif isinstance(payload, list):
        df = pd.DataFrame(payload)
    else:
        raise InputValidationError("Payload must be dict, list[dict], or pandas DataFrame.")

    missing_cols = [col for col in expected_columns if col not in df.columns]
    if missing_cols:
        raise InputValidationError(f"Missing required fields: {missing_cols}")

    df = df[list(expected_columns)].copy()

    # Light type coercion for numeric-looking object values.
    for col in df.columns:
        if df[col].dtype == object:
            coerced = pd.to_numeric(df[col], errors="ignore")
            df[col] = coerced

    return df


def _safe_predict_proba(model, X):
    if hasattr(model, "predict_proba"):
        return model.predict_proba(X)[:, 1]
    if hasattr(model, "decision_function"):
        raw = np.asarray(model.decision_function(X), dtype=float)
        return (raw - raw.min()) / (raw.max() - raw.min() + 1e-9)
    return model.predict(X).astype(float)


@dataclass
class ModelService:
    """Runtime service for validating payload and returning risk outputs."""

    pipeline: Any
    threshold: float
    input_columns: List[str]
    pipeline_input_columns: List[str]

    @classmethod
    def load(cls, bundle_path: str) -> "ModelService":
        bundle = joblib.load(bundle_path)

        if isinstance(bundle, dict) and "pipeline" in bundle:
            pipeline = bundle["pipeline"]
            threshold = float(bundle.get("threshold", 0.50))
            input_columns = list(bundle.get("input_columns", []))
            pipeline_input_columns = list(bundle.get("pipeline_input_columns", input_columns))
        else:
            # Backward compatibility with old artifact format storing only model.
            pipeline = bundle
            threshold = 0.50
            input_columns = list(getattr(pipeline, "feature_names_in_", []))
            pipeline_input_columns = list(input_columns)

        if not input_columns:
            raise InputValidationError(
                "input_columns were not found in artifact; cannot validate payload schema."
            )

        return cls(
            pipeline=pipeline,
            threshold=threshold,
            input_columns=input_columns,
            pipeline_input_columns=pipeline_input_columns,
        )

    def predict(self, payload: PayloadType) -> List[Dict[str, Any]]:
        df = validate_api_input(payload, self.input_columns)
        df = feature_engineer(df)

        missing_engineered = [col for col in self.pipeline_input_columns if col not in df.columns]
        if missing_engineered:
            raise InputValidationError(f"Missing engineered features after preprocessing: {missing_engineered}")

        df = df[self.pipeline_input_columns]
        probabilities = _safe_predict_proba(self.pipeline, df)
        predictions = classify_with_threshold(probabilities, self.threshold)

        rows = []
        for pred, prob in zip(predictions, probabilities):
            rows.append(
                {
                    "predicted_class": int(pred),
                    "disease_probability": float(prob),
                    "disease_probability_percent": float(prob * 100.0),
                    "risk_category": risk_category(float(prob)),
                    "threshold": float(self.threshold),
                }
            )

        return rows
