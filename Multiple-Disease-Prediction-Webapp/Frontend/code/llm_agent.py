import os
from pathlib import Path


class GroqConfigError(Exception):
    """Raised when Groq environment variables are missing."""


class GroqDependencyError(Exception):
    """Raised when optional Groq client dependencies are not installed."""


class GroqServiceError(Exception):
    """Raised when a Groq request fails."""


def build_fallback_explanation(
    disease_name,
    probability_percent,
    risk_category,
    symptoms,
    static_description,
    precautions,
):
    symptom_text = ", ".join(symptoms) if symptoms else "No symptoms provided"
    precaution_lines = []
    if isinstance(precautions, (list, tuple)):
        precaution_lines = [f"- {item}" for item in precautions[:4]]
    elif precautions:
        precaution_lines = [f"- {precautions}"]
    else:
        precaution_lines = ["- Consult a healthcare professional for tailored precautions."]

    precaution_block = "\n".join(precaution_lines)
    probability_text = (
        f"**{probability_percent:.2f}%** confidence"
        if probability_percent is not None
        else "confidence not available from this model"
    )
    return (
        f"### What this means\n"
        f"- The prediction suggests **{disease_name}** with {probability_text}.\n"
        f"- The current risk label is **{risk_category}**.\n"
        f"- This is a model estimate, not a confirmed medical diagnosis.\n\n"
        f"### Why the model may have picked this\n"
        f"- Symptoms considered: {symptom_text}.\n"
        f"- Reference description: {static_description}\n\n"
        f"### Next steps\n"
        f"{precaution_block}\n"
        f"- If symptoms persist or worsen, seek medical evaluation.\n\n"
        f"### Important reminder\n"
        f"- Get urgent care for severe pain, trouble breathing, confusion, heavy bleeding, or rapid worsening.\n"
    )


def _load_local_env():
    try:
        from dotenv import load_dotenv
    except ImportError:
        return

    frontend_dir = Path(__file__).resolve().parents[1]
    env_candidates = [Path.cwd() / ".env", frontend_dir / ".env"]

    for env_path in env_candidates:
        if env_path.exists():
            load_dotenv(env_path, override=False)


def get_groq_agent_status():
    _load_local_env()

    try:
        from groq import Groq  # noqa: F401
    except ImportError:
        return (
            False,
            "Groq agent is disabled. Install `groq` and `python-dotenv`, then restart Streamlit.",
        )

    if not os.getenv("GROQ_API_KEY"):
        return (
            False,
            "Groq agent is disabled. Add your key to `Frontend/.env` as `GROQ_API_KEY=...`.",
        )

    return True, "Groq agent is ready."


class GroqDiseaseAgentService:
    """Generate a richer patient-facing explanation from the ML prediction using Groq."""

    def __init__(self, model=None):
        _load_local_env()

        try:
            from groq import Groq
        except ImportError as exc:
            raise GroqDependencyError(
                "Missing dependency: install `groq` and `python-dotenv` to enable the Groq layer."
            ) from exc

        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise GroqConfigError(
                "Missing `GROQ_API_KEY`. Paste your Groq key into `Frontend/.env` and rerun the app."
            )

        self.model = model or os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self.client = Groq(api_key=api_key)

    def generate_explanation(
        self,
        disease_name,
        probability_percent,
        risk_category,
        symptoms,
        static_description,
        precautions,
        source_label,
    ):
        precautions_text = (
            ", ".join(precautions)
            if isinstance(precautions, (list, tuple))
            else str(precautions)
        )
        symptom_text = ", ".join(symptoms) if symptoms else "No symptoms supplied"

        context = f"""
Prediction source: {source_label}
Predicted disease: {disease_name}
Model confidence: {f'{probability_percent:.2f}%' if probability_percent is not None else 'Not available'}
Risk category: {risk_category}
Selected or detected symptoms: {symptom_text}
Reference description: {static_description}
Recommended precautions: {precautions_text}
""".strip()

        try:
            triage_response = self.client.chat.completions.create(
                model=self.model,
                temperature=0.3,
                max_completion_tokens=700,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are TriageAgent, a careful medical screening assistant. "
                            "Summarize the likely reasoning behind the prediction, highlight useful follow-up questions, "
                            "and flag emergency red flags. Stay educational, do not diagnose with certainty, "
                            "and do not prescribe medication."
                        ),
                    },
                    {"role": "user", "content": context},
                ],
            )
            triage_notes = triage_response.choices[0].message.content or ""
            if not triage_notes.strip():
                raise GroqServiceError("Groq returned an empty triage response.")

            coach_response = self.client.chat.completions.create(
                model=self.model,
                temperature=0.2,
                max_completion_tokens=900,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are CareGuideAgent, a patient-friendly explanation assistant. "
                            "Turn medical model outputs into simple markdown. "
                            "Use these headings exactly: ### What this means, ### Why the model may have picked this, "
                            "### Next steps, and ### Important reminder. "
                            "Use short bullets, mention that this is not a confirmed diagnosis, "
                            "and advise urgent medical care for severe symptoms like chest pain, trouble breathing, "
                            "confusion, heavy bleeding, or rapidly worsening condition."
                        ),
                    },
                    {
                        "role": "user",
                        "content": (
                            f"Original prediction context:\n{context}\n\n"
                            f"Triage notes:\n{triage_notes}"
                        ),
                    },
                ],
            )
        except Exception as exc:
            details = str(exc).strip() or exc.__class__.__name__
            if "Connection error" in details or "WinError 10013" in details:
                details = (
                    "Connection to api.groq.com was blocked. Check firewall, antivirus, proxy, VPN, "
                    "or network rules that may stop Python from making outbound HTTPS requests."
                )
            raise GroqServiceError(
                f"Groq request failed. Please confirm your Groq API key, internet connection, and model access. Details: {details}"
            ) from exc

        explanation = (coach_response.choices[0].message.content or "").strip()
        if not explanation:
            raise GroqServiceError("Groq returned an empty explanation for this prediction.")

        return explanation
