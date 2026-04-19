import logging

import pandas as pd
import xgboost as xgb

logger = logging.getLogger(__name__)


class DiseaseModel:
    """Wrapper around XGBoost disease model with metadata helpers."""

    def __init__(self):
        self.all_symptoms = None
        self.symptoms = None
        self.pred_disease = None
        self.model = xgb.XGBClassifier()
        self.diseases = self.disease_list("data/dataset.csv")

    @staticmethod
    def risk_category(probability: float) -> str:
        """Map probability to risk bucket for UX-friendly output."""
        if probability < 0.30:
            return "Low Risk"
        if probability < 0.70:
            return "Medium Risk"
        return "High Risk"

    def load_xgboost(self, model_path):
        self.model.load_model(model_path)

    def save_xgboost(self, model_path):
        self.model.save_model(model_path)

    def predict(self, X):
        """Backward-compatible prediction return: (disease_name, probability)."""
        self.symptoms = X
        disease_pred_idx = self.model.predict(self.symptoms)
        self.pred_disease = self.diseases[disease_pred_idx].values[0]
        disease_probability_array = self.model.predict_proba(self.symptoms)
        disease_probability = float(disease_probability_array[0, disease_pred_idx[0]])
        return self.pred_disease, disease_probability

    def predict_with_risk(self, X):
        """Enhanced prediction payload with calibrated risk label."""
        prediction, probability = self.predict(X)
        return {
            "disease": prediction,
            "probability": probability,
            "probability_percent": probability * 100.0,
            "risk_category": self.risk_category(probability),
        }

    def describe_disease(self, disease_name):
        if disease_name not in self.diseases:
            return "That disease is not contemplated in this model"

        desc_df = pd.read_csv("data/symptom_Description.csv")
        desc_df = desc_df.apply(lambda col: col.str.strip())

        return desc_df[desc_df["Disease"] == disease_name]["Description"].values[0]

    def describe_predicted_disease(self):
        if self.pred_disease is None:
            return "No predicted disease yet"

        return self.describe_disease(self.pred_disease)

    def disease_precautions(self, disease_name):
        if disease_name not in self.diseases:
            return "That disease is not contemplated in this model"

        prec_df = pd.read_csv("data/symptom_precaution.csv")
        prec_df = prec_df.apply(lambda col: col.str.strip())

        return (
            prec_df[prec_df["Disease"] == disease_name]
            .filter(regex="Precaution")
            .values.tolist()[0]
        )

    def predicted_disease_precautions(self):
        if self.pred_disease is None:
            return "No predicted disease yet"

        return self.disease_precautions(self.pred_disease)

    def disease_list(self, kaggle_dataset):
        df = pd.read_csv("data/clean_dataset.tsv", sep="\t")
        y_data = df.iloc[:, -1]
        X_data = df.iloc[:, :-1]

        self.all_symptoms = X_data.columns
        y_data = y_data.astype("category")

        return y_data.cat.categories
