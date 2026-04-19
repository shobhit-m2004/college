from pathlib import Path

import pandas as pd

from config_utils import load_config
from inference import ModelService
from training import run_full_pipeline


def test_training_and_inference_smoke():
    cfg = load_config("config.yml")
    cfg["artifact_dir"] = "artifacts_test"
    cfg["n_jobs"] = 1

    artifact_dir = run_full_pipeline(cfg)
    bundle_path = Path(artifact_dir) / "inference_bundle.joblib"

    assert bundle_path.exists(), "inference bundle artifact missing"

    data = pd.read_csv(cfg["data_path"])
    sample_payload = data.drop(columns=[cfg["target"]]).iloc[0].to_dict()

    service = ModelService.load(str(bundle_path))
    out = service.predict(sample_payload)

    assert isinstance(out, list) and len(out) == 1
    assert "disease_probability_percent" in out[0]
    assert "risk_category" in out[0]


if __name__ == "__main__":
    test_training_and_inference_smoke()
    print("Smoke test passed.")
