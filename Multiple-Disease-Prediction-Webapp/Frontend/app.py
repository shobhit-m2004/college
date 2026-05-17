import base64
import os
import sys
from pathlib import Path

import streamlit as st
import plotly.express as px
from plotly.subplots import make_subplots
import plotly.graph_objects as go
import matplotlib.pyplot as plt
import pandas as pd
from streamlit_option_menu import option_menu
import pickle
from PIL import Image
import numpy as np
import plotly.figure_factory as ff
import streamlit as st

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))
os.chdir(BASE_DIR)

from code.DiseaseModel import DiseaseModel
from code.helper import prepare_symptoms_array
from code.llm_agent import (
    GroqConfigError,
    GroqDependencyError,
    GroqDiseaseAgentService,
    GroqServiceError,
    build_fallback_explanation,
    get_groq_agent_status,
)
import seaborn as sns
import matplotlib.pyplot as plt
import joblib

st.set_page_config(
    page_title="Multiple Disease Prediction",
    page_icon="",
    layout="wide",
)

# Custom CSS styling for modern healthcare UI
st.markdown("""
    <style>
    :root {
        --primary-blue: #0d5ea8;
        --primary-blue-dark: #094b86;
        --primary-blue-soft: #e7f2ff;
        --primary-blue-border: #cfe1f5;
        --accent-mint: #d9f1ea;
        --surface-white: rgba(255, 255, 255, 0.84);
        --surface-strong: #ffffff;
        --surface-alt: #f4f9ff;
        --text-main: #17324d;
        --text-soft: #5d7896;
        --success-bg: #edf9f4;
        --warning-bg: #fff8e8;
        --radius-md: 14px;
        --radius-lg: 24px;
        --radius-xl: 32px;
        --shadow-soft: 0 24px 80px rgba(23, 50, 77, 0.09);
        --shadow-card: 0 18px 45px rgba(23, 50, 77, 0.08);
    }

    .stApp {
        background:
            radial-gradient(circle at top left, rgba(13, 94, 168, 0.14), transparent 28%),
            radial-gradient(circle at top right, rgba(35, 173, 150, 0.12), transparent 24%),
            linear-gradient(180deg, #fffdf8 0%, #f5fbff 100%);
        color: var(--text-main);
    }

    .main {
        color: var(--text-main);
    }

    .block-container {
        padding-top: 1.2rem;
        padding-bottom: 2.4rem;
        max-width: 1220px;
    }

    h1, h2, h3 {
        color: var(--text-main);
        font-weight: 800;
        letter-spacing: -0.03em;
    }

    p, span, label, div {
        color: var(--text-main);
    }

    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #edf6ff 0%, #f7fbff 100%);
        border-right: 1px solid var(--primary-blue-border);
    }

    [data-testid="stSidebar"] * {
        color: var(--text-main);
    }

    .sidebar-brand {
        padding: 1rem 1rem 0.4rem 1rem;
        margin-bottom: 0.6rem;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.75);
        border: 1px solid var(--primary-blue-border);
        box-shadow: var(--shadow-card);
    }

    .sidebar-brand-kicker {
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--primary-blue);
        margin-bottom: 0.4rem;
    }

    .sidebar-brand-title {
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--text-main);
        margin-bottom: 0.25rem;
    }

    .sidebar-brand-copy {
        font-size: 0.92rem;
        line-height: 1.6;
        color: var(--text-soft);
        margin-bottom: 0.9rem;
    }

    .hero-card {
        padding: 2rem 2rem 1.7rem 2rem;
        border-radius: var(--radius-xl);
        border: 1px solid rgba(255, 255, 255, 0.72);
        background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(247, 251, 255, 0.95) 100%);
        box-shadow: var(--shadow-soft);
        backdrop-filter: blur(10px);
    }

    .hero-kicker {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        margin-bottom: 1rem;
        padding: 0.5rem 0.85rem;
        border-radius: 999px;
        border: 1px solid var(--primary-blue-border);
        background: var(--primary-blue-soft);
        color: var(--primary-blue);
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
    }

    .hero-title {
        font-size: clamp(2rem, 4vw, 3.45rem);
        line-height: 1.02;
        font-weight: 800;
        color: #10253d;
        margin-bottom: 0.9rem;
    }

    .hero-copy {
        font-size: 1.02rem;
        line-height: 1.8;
        color: var(--text-soft);
        max-width: 780px;
        margin-bottom: 1rem;
    }

    .hero-chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.7rem;
        margin-top: 1rem;
    }

    .hero-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.55rem 0.95rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid var(--primary-blue-border);
        box-shadow: 0 10px 24px rgba(23, 50, 77, 0.06);
        color: var(--text-main);
        font-size: 0.9rem;
        font-weight: 600;
    }

    .info-card {
        padding: 1.15rem 1.2rem;
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(240,248,255,0.96) 100%);
        border: 1px solid var(--primary-blue-border);
        box-shadow: var(--shadow-card);
        min-height: 100%;
    }

    .info-card-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 0.45rem;
    }

    .info-card-copy {
        font-size: 0.92rem;
        line-height: 1.7;
        color: var(--text-soft);
    }

    .result-banner {
        padding: 1.15rem 1.25rem;
        border-radius: 24px;
        border: 1px solid var(--primary-blue-border);
        background: linear-gradient(135deg, rgba(231,242,255,0.95) 0%, rgba(255,255,255,0.95) 100%);
        box-shadow: var(--shadow-card);
        margin: 0.35rem 0 1rem 0;
    }

    .result-banner-title {
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--primary-blue);
        margin-bottom: 0.35rem;
    }

    .result-banner-copy {
        font-size: 1rem;
        line-height: 1.75;
        color: var(--text-main);
    }

    .hero-visual-shell {
        padding: 1rem;
        border-radius: var(--radius-xl);
        border: 1px solid rgba(255, 255, 255, 0.72);
        background: linear-gradient(145deg, rgba(13,94,168,0.95) 0%, rgba(41,129,203,0.94) 55%, rgba(47,176,156,0.9) 100%);
        box-shadow: var(--shadow-soft);
    }

    .hero-visual-inner {
        border-radius: 26px;
        background: rgba(255, 255, 255, 0.94);
        min-height: 320px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.2rem;
    }

    .hero-visual-inner img {
        width: 100%;
        max-height: 360px;
        object-fit: contain;
        display: block;
        border-radius: 22px;
        box-shadow: 0 18px 45px rgba(23, 50, 77, 0.10);
    }

    .stButton > button {
        background: linear-gradient(135deg, var(--primary-blue) 0%, #2575c8 100%);
        color: #ffffff;
        border-radius: 999px;
        border: none;
        box-shadow: 0 16px 40px rgba(13, 94, 168, 0.25);
        font-weight: 700;
        width: 100%;
        min-height: 3rem;
        padding: 0.7rem 1rem;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .stButton > button:hover {
        background: linear-gradient(135deg, var(--primary-blue-dark) 0%, var(--primary-blue) 100%);
        color: #ffffff;
        transform: translateY(-1px);
        box-shadow: 0 20px 42px rgba(13, 94, 168, 0.28);
    }

    .stTextInput > div > div > input,
    .stTextArea textarea,
    .stNumberInput > div > div > input,
    .stSelectbox > div > div,
    .stMultiSelect > div > div,
    .stDateInput > div > div,
    .stFileUploader > div {
        background-color: rgba(255, 255, 255, 0.96);
        color: var(--text-main);
        border: 1px solid var(--primary-blue-border);
        border-radius: var(--radius-md);
        box-shadow: 0 12px 30px rgba(23, 50, 77, 0.05);
    }

    .stTextInput > div > div > input:focus,
    .stTextArea textarea:focus,
    .stNumberInput > div > div > input:focus {
        border-color: var(--primary-blue);
        box-shadow: 0 0 0 1px var(--primary-blue);
    }

    .stMultiSelect [data-baseweb="tag"] {
        background-color: var(--primary-blue-soft);
        border-radius: 999px;
        border: 1px solid var(--primary-blue-border);
    }

    .stSuccess {
        background-color: var(--success-bg);
        color: var(--text-main);
        border: 1px solid #bde3cd;
        border-radius: var(--radius-md);
    }

    .stWarning {
        background-color: var(--warning-bg);
        color: #664400;
        border: 1px solid #ffd27d;
        border-radius: var(--radius-md);
    }

    .stInfo {
        background-color: var(--primary-blue-soft);
        color: var(--text-main);
        border: 1px solid var(--primary-blue-border);
        border-radius: var(--radius-md);
    }

    [data-baseweb="tab"] {
        background-color: rgba(255, 255, 255, 0.7);
        color: var(--primary-blue);
        border-radius: 999px;
        border: 1px solid transparent;
        font-weight: 700;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    [data-baseweb="tab"]:hover {
        background-color: var(--primary-blue-soft);
        border-color: var(--primary-blue-border);
    }

    button[aria-selected="true"] {
        background-color: var(--primary-blue) !important;
        color: #ffffff !important;
        border-color: var(--primary-blue) !important;
    }

    [data-testid="metric-container"] {
        background: linear-gradient(180deg, #ffffff 0%, #f6fbff 100%);
        border: 1px solid var(--primary-blue-border);
        border-radius: var(--radius-lg);
        padding: 1rem;
        box-shadow: var(--shadow-card);
    }

    [data-testid="stExpander"] {
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid var(--primary-blue-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-card);
    }

    .stDataFrame, .stTable {
        background: var(--surface-strong);
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-card);
    }

    hr {
        border-color: var(--primary-blue-border);
    }

    .stCaption {
        color: var(--text-soft);
    }

    .stImage img {
        border-radius: 28px;
        box-shadow: var(--shadow-card);
    }
    </style>
    """, unsafe_allow_html=True)

def decimal_input(label, **kwargs):
    kwargs.setdefault("value", 0.0)
    kwargs.setdefault("step", 0.01)
    kwargs.setdefault("format", "%.2f")
    return st.number_input(label, **kwargs)


def asset_path(filename):
    return str(BASE_DIR / filename)


def image_to_data_uri(filename):
    file_path = BASE_DIR / filename
    extension = file_path.suffix.lower().lstrip(".") or "png"
    mime_type = "image/jpeg" if extension in {"jpg", "jpeg"} else f"image/{extension}"
    encoded = base64.b64encode(file_path.read_bytes()).decode("utf-8")
    return f"data:{mime_type};base64,{encoded}"


def render_page_hero(title, eyebrow, description, chips=None, image_name=None):
    chips = chips or []

    if image_name:
        left_col, right_col = st.columns([1.35, 0.65], gap="large")
    else:
        left_col = st.container()
        right_col = None

    with left_col:
        chip_markup = "".join(
            f"<span class='hero-chip'>{chip}</span>" for chip in chips
        )
        st.markdown(
            f"""
            <div class="hero-card">
                <div class="hero-kicker">{eyebrow}</div>
                <div class="hero-title">{title}</div>
                <div class="hero-copy">{description}</div>
                <div class="hero-chip-row">{chip_markup}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    if right_col and image_name:
        with right_col:
            st.markdown(
                f"""
                <div class="hero-visual-shell">
                    <div class="hero-visual-inner">
                        <img src="{image_to_data_uri(image_name)}" alt="{title}">
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )


def render_info_cards(cards):
    columns = st.columns(len(cards), gap="large")
    for column, card in zip(columns, cards):
        with column:
            st.markdown(
                f"""
                <div class="info-card">
                    <div class="info-card-title">{card["title"]}</div>
                    <div class="info-card-copy">{card["copy"]}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )


def render_result_banner(title, copy):
    st.markdown(
        f"""
        <div class="result-banner">
            <div class="result-banner-title">{title}</div>
            <div class="result-banner-copy">{copy}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def get_positive_probability(model, model_input, positive_label=1):
    if hasattr(model, "predict_proba"):
        probabilities = np.asarray(model.predict_proba(model_input), dtype=float)
        if probabilities.ndim == 2 and probabilities.shape[0] > 0:
            class_labels = list(getattr(model, "classes_", []))
            if class_labels and positive_label in class_labels:
                positive_index = class_labels.index(positive_label)
            else:
                positive_index = min(probabilities.shape[1] - 1, 1)
            return float(probabilities[0, positive_index])

    if hasattr(model, "decision_function"):
        decision_scores = np.asarray(model.decision_function(model_input), dtype=float).reshape(-1)
        if decision_scores.size > 0:
            clipped_score = float(np.clip(decision_scores[0], -20.0, 20.0))
            return float(1.0 / (1.0 + np.exp(-clipped_score)))

    return None


def classify_severity(probability):
    if probability is None:
        return "Unavailable"
    if probability < 0.30:
        return "Low"
    if probability < 0.70:
        return "Moderate"
    return "High"


def render_severity_summary(model, model_input, predicted_label, positive_label=1):
    probability = get_positive_probability(model, model_input, positive_label=positive_label)
    severity = classify_severity(probability)
    predicted_positive = predicted_label == positive_label
    severity_title = "Disease Severity" if predicted_positive else "Risk Severity"

    col1, col2 = st.columns(2)
    with col1:
        st.metric(severity_title, severity)
    with col2:
        if probability is not None:
            st.metric("Disease Score", f"{probability * 100:.2f}%")
        else:
            st.metric("Disease Score", "N/A")


def render_precautions(precautions):
    if isinstance(precautions, str):
        st.write(precautions)
        return

    for index, precaution in enumerate(precautions[:4], start=1):
        st.write(f"{index}. {precaution}")


def render_groq_agent_description(prediction, symptoms, disease_model, source_label):
    st.caption("Extra LLM description powered by a Groq multi-agent explanation flow.")
    is_ready, status_message = get_groq_agent_status()
    if not is_ready:
        st.info(status_message)
        return

    static_description = disease_model.describe_predicted_disease()
    precautions = disease_model.predicted_disease_precautions()
    fallback_explanation = build_fallback_explanation(
        disease_name=prediction["disease"],
        probability_percent=prediction["probability_percent"],
        risk_category=prediction["risk_category"],
        symptoms=symptoms,
        static_description=static_description,
        precautions=precautions,
    )

    if "ai_agent_cache" not in st.session_state:
        st.session_state.ai_agent_cache = {}

    cache_key = "|".join(
        [
            source_label,
            prediction["disease"],
            f'{prediction["probability_percent"]:.2f}',
            prediction["risk_category"],
            ",".join(sorted(symptoms)),
        ]
    )

    if cache_key not in st.session_state.ai_agent_cache:
        try:
            agent_service = GroqDiseaseAgentService()
            with st.spinner("Groq is preparing a richer explanation..."):
                st.session_state.ai_agent_cache[cache_key] = agent_service.generate_explanation(
                    disease_name=prediction["disease"],
                    probability_percent=prediction["probability_percent"],
                    risk_category=prediction["risk_category"],
                    symptoms=symptoms,
                    static_description=static_description,
                    precautions=precautions,
                    source_label=source_label,
                )
        except (GroqConfigError, GroqDependencyError) as exc:
            st.info(str(exc))
            st.markdown("### Fallback Explanation")
            st.markdown(fallback_explanation)
            return
        except GroqServiceError as exc:
            st.warning(str(exc))
            st.markdown("### Fallback Explanation")
            st.markdown(fallback_explanation)
            return

    st.markdown(st.session_state.ai_agent_cache[cache_key])

# Configure Plotly theme
import plotly.io as pio
pio.templates.default = "plotly_white"

# Custom plotly layout styling
custom_layout = dict(
    template="plotly_white",
    plot_bgcolor="#FFFFFF",
    paper_bgcolor="#FFFFFF",
    font=dict(family="sans-serif", size=12, color="#003366"),
    xaxis=dict(linecolor="#0066CC", mirror=True),
    yaxis=dict(linecolor="#0066CC", mirror=True),
    showlegend=True,
    hovermode="x unified"
)




# loading the models
diabetes_model = joblib.load("models/diabetes_model.sav")
heart_model = joblib.load("models/heart_disease_model.sav")
parkinson_model = joblib.load("models/parkinsons_model.sav")
# Load the lung cancer prediction model
lung_cancer_model = joblib.load('models/lung_cancer_model.sav')

# Load the pre-trained model
breast_cancer_model = joblib.load('models/breast_cancer.sav')

# Load the pre-trained model
chronic_disease_model = joblib.load('models/chronic_model.sav')

# Load the hepatitis prediction model
hepatitis_model = joblib.load('models/hepititisc_model.sav')


liver_model = joblib.load('models/liver_model.sav')# Load the lung cancer prediction model
lung_cancer_model = joblib.load('models/lung_cancer_model.sav')


# sidebar
with st.sidebar:
    st.markdown(
        """
        <div class="sidebar-brand">
            <div class="sidebar-brand-kicker">Smart Care</div>
            <div class="sidebar-brand-title">Disease Prediction Suite</div>
            <div class="sidebar-brand-copy">
                Explore multiple prediction models from one modern screening workspace.
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    selected = option_menu('Multiple Disease Prediction', [
        'Disease Prediction',
        'Diabetes Prediction',
        'Heart disease Prediction',
        'Parkison Prediction',
        'Liver prediction',
        'Hepatitis prediction',
        'Lung Cancer Prediction',
        'Chronic Kidney prediction',
        'Breast Cancer Prediction',

    ],
        icons=['', 'activity', 'heart', 'person', 'person', 'person', 'person', 'person', 'bar-chart-fill'],
        default_index=0,
        styles={
            "container": {
                "padding": "0.35rem",
                "background-color": "rgba(255,255,255,0.68)",
                "border": "1px solid #cfe1f5",
                "border-radius": "24px",
                "box-shadow": "0 18px 45px rgba(23, 50, 77, 0.08)",
            },
            "icon": {"color": "#0d5ea8", "font-size": "16px"},
            "nav-link": {
                "font-size": "15px",
                "font-weight": "600",
                "text-align": "left",
                "margin": "0.25rem 0",
                "padding": "0.7rem 0.95rem",
                "border-radius": "16px",
                "--hover-color": "#e7f2ff",
            },
            "nav-link-selected": {
                "background": "linear-gradient(135deg, #0d5ea8 0%, #2575c8 100%)",
                "color": "white",
            },
        })




# multiple disease prediction
if selected == 'Disease Prediction': 
    # Create disease class and load ML model
    disease_model = DiseaseModel()
    disease_model.load_xgboost('model/xgboost_model.json')

    render_page_hero(
        title="Modern symptom-based disease prediction.",
        eyebrow="Core Screening Flow",
        description=(
            "Select symptoms, run the machine learning model, and review risk guidance "
            "inside a cleaner clinical-style interface designed for quick understanding."
        ),
        chips=["Symptom triage", "Confidence scoring", "Risk explanation", "Groq-ready insights"],
        image_name="logo.png",
    )
    render_info_cards(
        [
            {
                "title": "Choose symptoms carefully",
                "copy": "Select at least three symptoms to give the model enough context for a more reliable prediction.",
            },
            {
                "title": "Review risk, not diagnosis",
                "copy": "Predictions estimate likelihood and should be used as a decision-support layer, not a confirmed medical result.",
            },
            {
                "title": "Use the explanation tabs",
                "copy": "Read the disease description, precaution advice, and optional Groq explanation for a clearer next step.",
            },
        ]
    )

    st.markdown("### Symptom selection")
    st.caption("Tip: use `high_fever` or `mild_fever` instead of just `fever`.")

    symptoms = st.multiselect(
        'What are your symptoms?',
        options=disease_model.all_symptoms,
        help="Tip: use 'high_fever' or 'mild_fever' instead of just 'fever'.",
    )

    X = prepare_symptoms_array(symptoms)
    metric_col1, metric_col2, metric_col3 = st.columns(3)
    with metric_col1:
        st.metric("Symptoms Selected", len(symptoms))
    with metric_col2:
        st.metric("Minimum Recommended", "3")
    with metric_col3:
        st.metric("Model", "XGBoost")

    # Trigger XGBoost model
    if st.button('Predict'):
        if len(symptoms) < 3:
            st.warning("Please select at least 3 symptoms for a reliable prediction.")
        else:
            # Run the model with the python script
            pred = disease_model.predict_with_risk(X)
            if pred["probability"] < 0.40:
                st.warning("Low confidence prediction. Add more symptoms for better accuracy.")
            render_result_banner(
                "Prediction summary",
                (
                    f"The model currently suggests <strong>{pred['disease']}</strong> "
                    f"with a confidence score of <strong>{pred['probability_percent']:.2f}%</strong> "
                    f"and a <strong>{pred['risk_category']}</strong> risk category."
                ),
            )

            result_col1, result_col2, result_col3 = st.columns(3)
            with result_col1:
                st.metric("Predicted Disease", pred["disease"])
            with result_col2:
                st.metric("Confidence", f'{pred["probability_percent"]:.2f}%')
            with result_col3:
                st.metric("Risk Category", pred["risk_category"])

            tab1, tab2, tab3 = st.tabs(["Description", "Precautions", "Groq Agent Description"])

            with tab1:
                st.write(disease_model.describe_predicted_disease())

            with tab2:
                precautions = disease_model.predicted_disease_precautions()
                render_precautions(precautions)

            with tab3:
                render_groq_agent_description(
                    prediction=pred,
                    symptoms=symptoms,
                    disease_model=disease_model,
                    source_label="symptom form",
                )

# Diabetes prediction page
if selected == 'Diabetes Prediction':  # pagetitle
    render_page_hero(
        title="Diabetes disease prediction",
        eyebrow="Metabolic Health",
        description="Enter the patient indicators below to estimate diabetes risk with a cleaner modern screening layout.",
        chips=["Glucose", "BMI", "Age", "Insulin"],
        image_name="d3.jpg",
    )
    # columns
    # no inputs from the user
    name = st.text_input("Name:")
    col1, col2, col3 = st.columns(3)

    with col1:
        Pregnancies = decimal_input("Number of Pregnencies")
    with col2:
        Glucose = decimal_input("Glucose level")
    with col3:
        BloodPressure = decimal_input("Blood pressure  value")
    with col1:

        SkinThickness = decimal_input("Sckinthickness value")

    with col2:

        Insulin = decimal_input("Insulin value ")
    with col3:
        BMI = decimal_input("BMI value")
    with col1:
        DiabetesPedigreefunction = decimal_input(
            "Diabetespedigreefunction value")
    with col2:

        Age = decimal_input("AGE")

    # code for prediction
    diabetes_dig = ''

    # button
    if st.button("Diabetes test result"):
        diabetes_input = [[Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreefunction, Age]]
        diabetes_prediction=[[]]
        diabetes_prediction = diabetes_model.predict(diabetes_input)

        # after the prediction is done if the value in the list at index is 0 is 1 then the person is diabetic
        if diabetes_prediction[0] == 1:
            diabetes_dig = "we are really sorry to say but it seems like you are Diabetic."
            image = Image.open('positive.jpg')
            st.image(image, caption='')
        else:
            diabetes_dig = 'Congratulation,You are not diabetic'
            image = Image.open('negative.jpg')
            st.image(image, caption='')
        st.success(name+' , ' + diabetes_dig)
        render_severity_summary(diabetes_model, diabetes_input, diabetes_prediction[0], positive_label=1)
        
        



# Heart prediction page
if selected == 'Heart disease Prediction':
    render_page_hero(
        title="Heart disease prediction",
        eyebrow="Cardiac Risk",
        description="Capture cardiovascular indicators, exercise-related features, and ECG context to review heart disease risk.",
        chips=["Blood pressure", "Cholesterol", "ECG", "Exercise angina"],
        image_name="heart2.jpg",
    )
    # age	sex	cp	trestbps	chol	fbs	restecg	thalach	exang	oldpeak	slope	ca	thal	target
    # columns
    # no inputs from the user
    name = st.text_input("Name:")
    col1, col2, col3 = st.columns(3)

    with col1:
        age = decimal_input("Age")
    with col2:
        sex=0
        display = ("male", "female")
        options = list(range(len(display)))
        value = st.selectbox("Gender", options, format_func=lambda x: display[x])
        if value == "male":
            sex = 1
        elif value == "female":
            sex = 0
    with col3:
        cp=0
        display = ("typical angina","atypical angina","non â€” anginal pain","asymptotic")
        options = list(range(len(display)))
        value = st.selectbox("Chest_Pain Type", options, format_func=lambda x: display[x])
        if value == "typical angina":
            cp = 0
        elif value == "atypical angina":
            cp = 1
        elif value == "non â€” anginal pain":
            cp = 2
        elif value == "asymptotic":
            cp = 3
    with col1:
        trestbps = decimal_input("Resting Blood Pressure")

    with col2:

        chol = decimal_input("Serum Cholestrol")
    
    with col3:
        restecg=0
        display = ("normal","having ST-T wave abnormality","left ventricular hyperthrophy")
        options = list(range(len(display)))
        value = st.selectbox("Resting ECG", options, format_func=lambda x: display[x])
        if value == "normal":
            restecg = 0
        elif value == "having ST-T wave abnormality":
            restecg = 1
        elif value == "left ventricular hyperthrophy":
            restecg = 2

    with col1:
        exang=0
        thalach = decimal_input("Max Heart Rate Achieved")
   
    with col2:
        oldpeak = decimal_input("ST depression induced by exercise relative to rest")
    with col3:
        slope=0
        display = ("upsloping","flat","downsloping")
        options = list(range(len(display)))
        value = st.selectbox("Peak exercise ST segment", options, format_func=lambda x: display[x])
        if value == "upsloping":
            slope = 0
        elif value == "flat":
            slope = 1
        elif value == "downsloping":
            slope = 2
    with col1:
        ca = decimal_input("Number of major vessels (0â€“3) colored by flourosopy")
    with col2:
        thal=0
        display = ("normal","fixed defect","reversible defect")
        options = list(range(len(display)))
        value = st.selectbox("thalassemia", options, format_func=lambda x: display[x])
        if value == "normal":
            thal = 0
        elif value == "fixed defect":
            thal = 1
        elif value == "reversible defect":
            thal = 2
    with col3:
        agree = st.checkbox('Exercise induced angina')
        if agree:
            exang = 1
        else:
            exang=0
    with col1:
        agree1 = st.checkbox('fasting blood sugar > 120mg/dl')
        if agree1:
            fbs = 1
        else:
            fbs=0
    # code for prediction
    heart_dig = ''
    

    # button
    if st.button("Heart test result"):
        heart_prediction=[[]]
        heart_input = [[age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]]
        # change the parameters according to the model
        
        # b=np.array(a, dtype=float)
        heart_prediction = heart_model.predict(heart_input)

        if heart_prediction[0] == 1:
            heart_dig = 'we are really sorry to say but it seems like you have Heart Disease.'
            image = Image.open('positive.jpg')
            st.image(image, caption='')
            
        else:
            heart_dig = "Congratulation , You don't have Heart Disease."
            image = Image.open('negative.jpg')
            st.image(image, caption='')
        st.success(name +' , ' + heart_dig)
        render_severity_summary(heart_model, heart_input, heart_prediction[0], positive_label=1)









if selected == 'Parkison Prediction':
    render_page_hero(
        title="Parkinson prediction",
        eyebrow="Neurological Screening",
        description="Use the voice and tremor-related measurements below to estimate Parkinson's disease risk.",
        chips=["Voice metrics", "Jitter", "Shimmer", "Motor risk"],
        image_name="p1.jpg",
    )
  # parameters
#    name	MDVP:Fo(Hz)	MDVP:Fhi(Hz)	MDVP:Flo(Hz)	MDVP:Jitter(%)	MDVP:Jitter(Abs)	MDVP:RAP	MDVP:PPQ	Jitter:DDP	MDVP:Shimmer	MDVP:Shimmer(dB)	Shimmer:APQ3	Shimmer:APQ5	MDVP:APQ	Shimmer:DDA	NHR	HNR	status	RPDE	DFA	spread1	spread2	D2	PPE
   # change the variables according to the dataset used in the model
    name = st.text_input("Name:")
    col1, col2, col3 = st.columns(3)
    with col1:
        MDVP = decimal_input("MDVP:Fo(Hz)")
    with col2:
        MDVPFIZ = decimal_input("MDVP:Fhi(Hz)")
    with col3:
        MDVPFLO = decimal_input("MDVP:Flo(Hz)")
    with col1:
        MDVPJITTER = decimal_input("MDVP:Jitter(%)")
    with col2:
        MDVPJitterAbs = decimal_input("MDVP:Jitter(Abs)")
    with col3:
        MDVPRAP = decimal_input("MDVP:RAP")

    with col2:

        MDVPPPQ = decimal_input("MDVP:PPQ ")
    with col3:
        JitterDDP = decimal_input("Jitter:DDP")
    with col1:
        MDVPShimmer = decimal_input("MDVP:Shimmer")
    with col2:
        MDVPShimmer_dB = decimal_input("MDVP:Shimmer(dB)")
    with col3:
        Shimmer_APQ3 = decimal_input("Shimmer:APQ3")
    with col1:
        ShimmerAPQ5 = decimal_input("Shimmer:APQ5")
    with col2:
        MDVP_APQ = decimal_input("MDVP:APQ")
    with col3:
        ShimmerDDA = decimal_input("Shimmer:DDA")
    with col1:
        NHR = decimal_input("NHR")
    with col2:
        HNR = decimal_input("HNR")
  
    with col2:
        RPDE = decimal_input("RPDE")
    with col3:
        DFA = decimal_input("DFA")
    with col1:
        spread1 = decimal_input("spread1")
    with col1:
        spread2 = decimal_input("spread2")
    with col3:
        D2 = decimal_input("D2")
    with col1:
        PPE = decimal_input("PPE")

    # code for prediction
    parkinson_dig = ''
    
    # button
    if st.button("Parkinson test result"):
        parkinson_prediction=[[]]
        parkinson_input = [[MDVP, MDVPFIZ, MDVPFLO, MDVPJITTER, MDVPJitterAbs, MDVPRAP, MDVPPPQ, JitterDDP, MDVPShimmer,MDVPShimmer_dB, Shimmer_APQ3, ShimmerAPQ5, MDVP_APQ, ShimmerDDA, NHR, HNR,  RPDE, DFA, spread1, spread2, D2, PPE]]
        # change the parameters according to the model
        parkinson_prediction = parkinson_model.predict(parkinson_input)

        if parkinson_prediction[0] == 1:
            parkinson_dig = 'we are really sorry to say but it seems like you have Parkinson disease'
            image = Image.open('positive.jpg')
            st.image(image, caption='')
        else:
            parkinson_dig = "Congratulation , You don't have Parkinson disease"
            image = Image.open('negative.jpg')
            st.image(image, caption='')
        st.success(name+' , ' + parkinson_dig)
        render_severity_summary(parkinson_model, parkinson_input, parkinson_prediction[0], positive_label=1)



# Load the dataset
lung_cancer_data = pd.read_csv('data/lung_cancer.csv')

# Convert 'M' to 0 and 'F' to 1 in the 'GENDER' column
lung_cancer_data['GENDER'] = lung_cancer_data['GENDER'].map({'M': 'Male', 'F': 'Female'})

# Lung Cancer prediction page
if selected == 'Lung Cancer Prediction':
    render_page_hero(
        title="Lung cancer prediction",
        eyebrow="Respiratory Screening",
        description="Combine symptom and lifestyle indicators to review lung cancer risk through the trained model.",
        chips=["Smoking", "Chest pain", "Breathing", "Coughing"],
        image_name="h.png",
    )

    # Columns
    # No inputs from the user
    name = st.text_input("Name:")
    col1, col2, col3 = st.columns(3)

    with col1:
        gender = st.selectbox("Gender:", lung_cancer_data['GENDER'].unique())
    with col2:
        age = decimal_input("Age")
    with col3:
        smoking = st.selectbox("Smoking:", ['NO', 'YES'])
    with col1:
        yellow_fingers = st.selectbox("Yellow Fingers:", ['NO', 'YES'])

    with col2:
        anxiety = st.selectbox("Anxiety:", ['NO', 'YES'])
    with col3:
        peer_pressure = st.selectbox("Peer Pressure:", ['NO', 'YES'])
    with col1:
        chronic_disease = st.selectbox("Chronic Disease:", ['NO', 'YES'])

    with col2:
        fatigue = st.selectbox("Fatigue:", ['NO', 'YES'])
    with col3:
        allergy = st.selectbox("Allergy:", ['NO', 'YES'])
    with col1:
        wheezing = st.selectbox("Wheezing:", ['NO', 'YES'])

    with col2:
        alcohol_consuming = st.selectbox("Alcohol Consuming:", ['NO', 'YES'])
    with col3:
        coughing = st.selectbox("Coughing:", ['NO', 'YES'])
    with col1:
        shortness_of_breath = st.selectbox("Shortness of Breath:", ['NO', 'YES'])

    with col2:
        swallowing_difficulty = st.selectbox("Swallowing Difficulty:", ['NO', 'YES'])
    with col3:
        chest_pain = st.selectbox("Chest Pain:", ['NO', 'YES'])

    # Code for prediction
    cancer_result = ''

    # Button
    if st.button("Predict Lung Cancer"):
        # Create a DataFrame with user inputs
        user_data = pd.DataFrame({
            'GENDER': [gender],
            'AGE': [age],
            'SMOKING': [smoking],
            'YELLOW_FINGERS': [yellow_fingers],
            'ANXIETY': [anxiety],
            'PEER_PRESSURE': [peer_pressure],
            'CHRONICDISEASE': [chronic_disease],
            'FATIGUE': [fatigue],
            'ALLERGY': [allergy],
            'WHEEZING': [wheezing],
            'ALCOHOLCONSUMING': [alcohol_consuming],
            'COUGHING': [coughing],
            'SHORTNESSOFBREATH': [shortness_of_breath],
            'SWALLOWINGDIFFICULTY': [swallowing_difficulty],
            'CHESTPAIN': [chest_pain]
        })

        # Map string values to numeric
        user_data.replace({'NO': 1, 'YES': 2}, inplace=True)

        # Strip leading and trailing whitespaces from column names
        user_data.columns = user_data.columns.str.strip()

        # Convert columns to numeric where necessary
        numeric_columns = ['AGE', 'FATIGUE', 'ALLERGY', 'ALCOHOLCONSUMING', 'COUGHING', 'SHORTNESSOFBREATH']
        user_data[numeric_columns] = user_data[numeric_columns].apply(pd.to_numeric, errors='coerce')

        # Perform prediction
        cancer_prediction = lung_cancer_model.predict(user_data)

        # Display result
        if cancer_prediction[0] == 'YES':
            cancer_result = "The model predicts that there is a risk of Lung Cancer."
            image = Image.open('positive.jpg')
            st.image(image, caption='')
        else:
            cancer_result = "The model predicts no significant risk of Lung Cancer."
            image = Image.open('negative.jpg')
            st.image(image, caption='')

        st.success(name + ', ' + cancer_result)
        render_severity_summary(lung_cancer_model, user_data, cancer_prediction[0], positive_label='YES')




# Liver prediction page
if selected == 'Liver prediction':  # pagetitle
    render_page_hero(
        title="Liver disease prediction",
        eyebrow="Hepatic Assessment",
        description="Provide liver-related biomarkers and history inputs to estimate disease risk with the ML model.",
        chips=["Bilirubin", "Enzymes", "Proteins", "Age"],
        image_name="liver.jpg",
    )
    # columns
    # no inputs from the user
# st.write(info.astype(int).info())
    name = st.text_input("Name:")
    col1, col2, col3 = st.columns(3)

    with col1:
        Sex=0
        display = ("male", "female")
        options = list(range(len(display)))
        value = st.selectbox("Gender", options, format_func=lambda x: display[x])
        if value == "male":
            Sex = 0
        elif value == "female":
            Sex = 1
    with col2:
        age = decimal_input("Entre your age") # 2 
    with col3:
        Total_Bilirubin = decimal_input("Entre your Total_Bilirubin") # 3
    with col1:
        Direct_Bilirubin = decimal_input("Entre your Direct_Bilirubin")# 4

    with col2:
        Alkaline_Phosphotase = decimal_input("Entre your Alkaline_Phosphotase") # 5
    with col3:
        Alamine_Aminotransferase = decimal_input("Entre your Alamine_Aminotransferase") # 6
    with col1:
        Aspartate_Aminotransferase = decimal_input("Entre your Aspartate_Aminotransferase") # 7
    with col2:
        Total_Protiens = decimal_input("Entre your Total_Protiens")# 8
    with col3:
        Albumin = decimal_input("Entre your Albumin") # 9
    with col1:
        Albumin_and_Globulin_Ratio = decimal_input("Entre your Albumin_and_Globulin_Ratio") # 10 
    # code for prediction
    liver_dig = ''

    # button
    if st.button("Liver test result"):
        liver_prediction=[[]]
        liver_input = [[Sex,age,Total_Bilirubin,Direct_Bilirubin,Alkaline_Phosphotase,Alamine_Aminotransferase,Aspartate_Aminotransferase,Total_Protiens,Albumin,Albumin_and_Globulin_Ratio]]
        liver_prediction = liver_model.predict(liver_input)

        # after the prediction is done if the value in the list at index is 0 is 1 then the person is diabetic
        if liver_prediction[0] == 1:
            image = Image.open('positive.jpg')
            st.image(image, caption='')
            liver_dig = "we are really sorry to say but it seems like you have liver disease."
        else:
            image = Image.open('negative.jpg')
            st.image(image, caption='')
            liver_dig = "Congratulation , You don't have liver disease."
        st.success(name+' , ' + liver_dig)
        render_severity_summary(liver_model, liver_input, liver_prediction[0], positive_label=1)






# Hepatitis prediction page
if selected == 'Hepatitis prediction':
    render_page_hero(
        title="Hepatitis prediction",
        eyebrow="Liver Infection Screening",
        description="Review blood chemistry and liver function markers to estimate hepatitis risk in a modern panel layout.",
        chips=["ALT", "AST", "BIL", "GGT"],
        image_name="h.png",
    )

    # Columns
    # No inputs from the user
    name = st.text_input("Name:")
    col1, col2, col3 = st.columns(3)

    with col1:
        age = decimal_input("Enter your age")  # 2
    with col2:
        sex = st.selectbox("Gender", ["Male", "Female"])
        sex = 1 if sex == "Male" else 2
    with col3:
        total_bilirubin = decimal_input("Enter your Total Bilirubin")  # 3

    with col1:
        direct_bilirubin = decimal_input("Enter your Direct Bilirubin")  # 4
    with col2:
        alkaline_phosphatase = decimal_input("Enter your Alkaline Phosphatase")  # 5
    with col3:
        alamine_aminotransferase = decimal_input("Enter your Alamine Aminotransferase")  # 6

    with col1:
        aspartate_aminotransferase = decimal_input("Enter your Aspartate Aminotransferase")  # 7
    with col2:
        total_proteins = decimal_input("Enter your Total Proteins")  # 8
    with col3:
        albumin = decimal_input("Enter your Albumin")  # 9

    with col1:
        albumin_and_globulin_ratio = decimal_input("Enter your Albumin and Globulin Ratio")  # 10

    with col2:
        your_ggt_value = decimal_input("Enter your GGT value")  # Add this line
    with col3:
        your_prot_value = decimal_input("Enter your PROT value")  # Add this line

    # Code for prediction
    hepatitis_result = ''

    # Button
    if st.button("Predict Hepatitis"):
        # Create a DataFrame with user inputs
        user_data = pd.DataFrame({
            'Age': [age],
            'Sex': [sex],
            'ALB': [total_bilirubin],  # Correct the feature name
            'ALP': [direct_bilirubin],  # Correct the feature name
            'ALT': [alkaline_phosphatase],  # Correct the feature name
            'AST': [alamine_aminotransferase],
            'BIL': [aspartate_aminotransferase],  # Correct the feature name
            'CHE': [total_proteins],  # Correct the feature name
            'CHOL': [albumin],  # Correct the feature name
            'CREA': [albumin_and_globulin_ratio],  # Correct the feature name
            'GGT': [your_ggt_value],  # Replace 'your_ggt_value' with the actual value
            'PROT': [your_prot_value]  # Replace 'your_prot_value' with the actual value
        })

        # Perform prediction
        hepatitis_prediction = hepatitis_model.predict(user_data)
        # Display result
        if hepatitis_prediction[0] == 1:
            hepatitis_result = "We are really sorry to say but it seems like you have Hepatitis."
            image = Image.open('positive.jpg')
            st.image(image, caption='')
        else:
            hepatitis_result = 'Congratulations, you do not have Hepatitis.'
            image = Image.open('negative.jpg')
            st.image(image, caption='')

        st.success(name + ', ' + hepatitis_result)
        render_severity_summary(hepatitis_model, user_data, hepatitis_prediction[0], positive_label=1)











# jaundice prediction page
if selected == 'Jaundice prediction':  # pagetitle
    st.title("Jaundice disease prediction")
    image = Image.open('j.jpg')
    st.image(image, caption='Jaundice disease prediction')
    # columns
    # no inputs from the user
# st.write(info.astype(int).info())
    name = st.text_input("Name:")
    col1, col2, col3 = st.columns(3)

    with col1:
        age = decimal_input("Entre your age   ") # 2 
    with col2:
        Sex=0
        display = ("male", "female")
        options = list(range(len(display)))
        value = st.selectbox("Gender", options, format_func=lambda x: display[x])
        if value == "male":
            Sex = 0
        elif value == "female":
            Sex = 1
    with col3:
        Total_Bilirubin = decimal_input("Entre your Total_Bilirubin") # 3
    with col1:
        Direct_Bilirubin = decimal_input("Entre your Direct_Bilirubin")# 4

    with col2:
        Alkaline_Phosphotase = decimal_input("Entre your Alkaline_Phosphotase") # 5
    with col3:
        Alamine_Aminotransferase = decimal_input("Entre your Alamine_Aminotransferase") # 6
    with col1:
        Total_Protiens = decimal_input("Entre your Total_Protiens")# 8
    with col2:
        Albumin = decimal_input("Entre your Albumin") # 9 
    # code for prediction
    jaundice_dig = ''

    # button
    if st.button("Jaundice test result"):
        jaundice_prediction=[[]]
        jaundice_prediction = jaundice_model.predict([[age,Sex,Total_Bilirubin,Direct_Bilirubin,Alkaline_Phosphotase,Alamine_Aminotransferase,Total_Protiens,Albumin]])

        # after the prediction is done if the value in the list at index is 0 is 1 then the person is diabetic
        if jaundice_prediction[0] == 1:
            image = Image.open('positive.jpg')
            st.image(image, caption='')
            jaundice_dig = "we are really sorry to say but it seems like you have Jaundice."
        else:
            image = Image.open('negative.jpg')
            st.image(image, caption='')
            jaundice_dig = "Congratulation , You don't have Jaundice."
        st.success(name+' , ' + jaundice_dig)












from sklearn.preprocessing import LabelEncoder
import joblib




# Chronic Kidney Disease Prediction Page
if selected == 'Chronic Kidney prediction':
    render_page_hero(
        title="Chronic kidney disease prediction",
        eyebrow="Renal Health",
        description="Screen kidney disease risk using laboratory markers, blood pressure, and related health factors.",
        chips=["Creatinine", "Hemoglobin", "Blood pressure", "Diabetes"],
    )
    name = st.text_input("Name:")
    # Columns
    # No inputs from the user
    col1, col2, col3 = st.columns(3)

    with col1:
        age = st.slider("Enter your age", 1, 100, 25)  # 2
    with col2:
        bp = st.slider("Enter your Blood Pressure", 50, 200, 120)  # Add your own ranges
    with col3:
        sg = st.slider("Enter your Specific Gravity", 1.0, 1.05, 1.02)  # Add your own ranges

    with col1:
        al = st.slider("Enter your Albumin", 0, 5, 0)  # Add your own ranges
    with col2:
        su = st.slider("Enter your Sugar", 0, 5, 0)  # Add your own ranges
    with col3:
        rbc = st.selectbox("Red Blood Cells", ["Normal", "Abnormal"])
        rbc = 1 if rbc == "Normal" else 0

    with col1:
        pc = st.selectbox("Pus Cells", ["Normal", "Abnormal"])
        pc = 1 if pc == "Normal" else 0
    with col2:
        pcc = st.selectbox("Pus Cell Clumps", ["Present", "Not Present"])
        pcc = 1 if pcc == "Present" else 0
    with col3:
        ba = st.selectbox("Bacteria", ["Present", "Not Present"])
        ba = 1 if ba == "Present" else 0

    with col1:
        bgr = st.slider("Enter your Blood Glucose Random", 50, 200, 120)  # Add your own ranges
    with col2:
        bu = st.slider("Enter your Blood Urea", 10, 200, 60)  # Add your own ranges
    with col3:
        sc = st.slider("Enter your Serum Creatinine", 0, 10, 3)  # Add your own ranges

    with col1:
        sod = st.slider("Enter your Sodium", 100, 200, 140)  # Add your own ranges
    with col2:
        pot = st.slider("Enter your Potassium", 2, 7, 4)  # Add your own ranges
    with col3:
        hemo = st.slider("Enter your Hemoglobin", 3, 17, 12)  # Add your own ranges

    with col1:
        pcv = st.slider("Enter your Packed Cell Volume", 20, 60, 40)  # Add your own ranges
    with col2:
        wc = st.slider("Enter your White Blood Cell Count", 2000, 20000, 10000)  # Add your own ranges
    with col3:
        rc = st.slider("Enter your Red Blood Cell Count", 2, 8, 4)  # Add your own ranges

    with col1:
        htn = st.selectbox("Hypertension", ["Yes", "No"])
        htn = 1 if htn == "Yes" else 0
    with col2:
        dm = st.selectbox("Diabetes Mellitus", ["Yes", "No"])
        dm = 1 if dm == "Yes" else 0
    with col3:
        cad = st.selectbox("Coronary Artery Disease", ["Yes", "No"])
        cad = 1 if cad == "Yes" else 0

    with col1:
        appet = st.selectbox("Appetite", ["Good", "Poor"])
        appet = 1 if appet == "Good" else 0
    with col2:
        pe = st.selectbox("Pedal Edema", ["Yes", "No"])
        pe = 1 if pe == "Yes" else 0
    with col3:
        ane = st.selectbox("Anemia", ["Yes", "No"])
        ane = 1 if ane == "Yes" else 0

    # Code for prediction
    kidney_result = ''

    # Button
    if st.button("Predict Chronic Kidney Disease"):
        # Create a DataFrame with user inputs
        user_input = pd.DataFrame({
            'age': [age],
            'bp': [bp],
            'sg': [sg],
            'al': [al],
            'su': [su],
            'rbc': [rbc],
            'pc': [pc],
            'pcc': [pcc],
            'ba': [ba],
            'bgr': [bgr],
            'bu': [bu],
            'sc': [sc],
            'sod': [sod],
            'pot': [pot],
            'hemo': [hemo],
            'pcv': [pcv],
            'wc': [wc],
            'rc': [rc],
            'htn': [htn],
            'dm': [dm],
            'cad': [cad],
            'appet': [appet],
            'pe': [pe],
            'ane': [ane]
        })

        # Perform prediction
        kidney_prediction = chronic_disease_model.predict(user_input)
        # Display result
        if kidney_prediction[0] == 1:
            image = Image.open('positive.jpg')
            st.image(image, caption='')
            kidney_prediction_dig = "we are really sorry to say but it seems like you have kidney disease."
        else:
            image = Image.open('negative.jpg')
            st.image(image, caption='')
            kidney_prediction_dig = "Congratulation , You don't have kidney disease."
        st.success(name+' , ' + kidney_prediction_dig)
        render_severity_summary(chronic_disease_model, user_input, kidney_prediction[0], positive_label=1)



# Breast Cancer Prediction Page
if selected == 'Breast Cancer Prediction':
    render_page_hero(
        title="Breast cancer prediction",
        eyebrow="Oncology Screening",
        description="Enter tumor feature measurements to generate a breast cancer risk estimate from the trained model.",
        chips=["Radius", "Texture", "Area", "Concavity"],
    )
    name = st.text_input("Name:")
    # Columns
    # No inputs from the user
    col1, col2, col3 = st.columns(3)

    with col1:
        radius_mean = st.slider("Enter your Radius Mean", 6.0, 30.0, 15.0)
        texture_mean = st.slider("Enter your Texture Mean", 9.0, 40.0, 20.0)
        perimeter_mean = st.slider("Enter your Perimeter Mean", 43.0, 190.0, 90.0)

    with col2:
        area_mean = st.slider("Enter your Area Mean", 143.0, 2501.0, 750.0)
        smoothness_mean = st.slider("Enter your Smoothness Mean", 0.05, 0.25, 0.1)
        compactness_mean = st.slider("Enter your Compactness Mean", 0.02, 0.3, 0.15)

    with col3:
        concavity_mean = st.slider("Enter your Concavity Mean", 0.0, 0.5, 0.2)
        concave_points_mean = st.slider("Enter your Concave Points Mean", 0.0, 0.2, 0.1)
        symmetry_mean = st.slider("Enter your Symmetry Mean", 0.1, 1.0, 0.5)

    with col1:
        fractal_dimension_mean = st.slider("Enter your Fractal Dimension Mean", 0.01, 0.1, 0.05)
        radius_se = st.slider("Enter your Radius SE", 0.1, 3.0, 1.0)
        texture_se = st.slider("Enter your Texture SE", 0.2, 2.0, 1.0)

    with col2:
        perimeter_se = st.slider("Enter your Perimeter SE", 1.0, 30.0, 10.0)
        area_se = st.slider("Enter your Area SE", 6.0, 500.0, 150.0)
        smoothness_se = st.slider("Enter your Smoothness SE", 0.001, 0.03, 0.01)

    with col3:
        compactness_se = st.slider("Enter your Compactness SE", 0.002, 0.2, 0.1)
        concavity_se = st.slider("Enter your Concavity SE", 0.0, 0.05, 0.02)
        concave_points_se = st.slider("Enter your Concave Points SE", 0.0, 0.03, 0.01)

    with col1:
        symmetry_se = st.slider("Enter your Symmetry SE", 0.1, 1.0, 0.5)
        fractal_dimension_se = st.slider("Enter your Fractal Dimension SE", 0.01, 0.1, 0.05)

    with col2:
        radius_worst = st.slider("Enter your Radius Worst", 7.0, 40.0, 20.0)
        texture_worst = st.slider("Enter your Texture Worst", 12.0, 50.0, 25.0)
        perimeter_worst = st.slider("Enter your Perimeter Worst", 50.0, 250.0, 120.0)

    with col3:
        area_worst = st.slider("Enter your Area Worst", 185.0, 4250.0, 1500.0)
        smoothness_worst = st.slider("Enter your Smoothness Worst", 0.07, 0.3, 0.15)
        compactness_worst = st.slider("Enter your Compactness Worst", 0.03, 0.6, 0.3)

    with col1:
        concavity_worst = st.slider("Enter your Concavity Worst", 0.0, 0.8, 0.4)
        concave_points_worst = st.slider("Enter your Concave Points Worst", 0.0, 0.2, 0.1)
        symmetry_worst = st.slider("Enter your Symmetry Worst", 0.1, 1.0, 0.5)

    with col2:
        fractal_dimension_worst = st.slider("Enter your Fractal Dimension Worst", 0.01, 0.2, 0.1)

        # Code for prediction
    breast_cancer_result = ''

    # Button
    if st.button("Predict Breast Cancer"):
        # Create a DataFrame with user inputs
        user_input = pd.DataFrame({
            'radius_mean': [radius_mean],
            'texture_mean': [texture_mean],
            'perimeter_mean': [perimeter_mean],
            'area_mean': [area_mean],
            'smoothness_mean': [smoothness_mean],
            'compactness_mean': [compactness_mean],
            'concavity_mean': [concavity_mean],
            'concave points_mean': [concave_points_mean],  # Update this line
            'symmetry_mean': [symmetry_mean],
            'fractal_dimension_mean': [fractal_dimension_mean],
            'radius_se': [radius_se],
            'texture_se': [texture_se],
            'perimeter_se': [perimeter_se],
            'area_se': [area_se],
            'smoothness_se': [smoothness_se],
            'compactness_se': [compactness_se],
            'concavity_se': [concavity_se],
            'concave points_se': [concave_points_se],  # Update this line
            'symmetry_se': [symmetry_se],
            'fractal_dimension_se': [fractal_dimension_se],
            'radius_worst': [radius_worst],
            'texture_worst': [texture_worst],
            'perimeter_worst': [perimeter_worst],
            'area_worst': [area_worst],
            'smoothness_worst': [smoothness_worst],
            'compactness_worst': [compactness_worst],
            'concavity_worst': [concavity_worst],
            'concave points_worst': [concave_points_worst],  # Update this line
            'symmetry_worst': [symmetry_worst],
            'fractal_dimension_worst': [fractal_dimension_worst],
        })

        # Perform prediction
        breast_cancer_prediction = breast_cancer_model.predict(user_input)
        # Display result
        if breast_cancer_prediction[0] == 1:
            image = Image.open('positive.jpg')
            st.image(image, caption='')
            breast_cancer_result = "The model predicts that you have Breast Cancer."
        else:
            image = Image.open('negative.jpg')
            st.image(image, caption='')
            breast_cancer_result = "The model predicts that you don't have Breast Cancer."

        st.success(breast_cancer_result)
        render_severity_summary(breast_cancer_model, user_input, breast_cancer_prediction[0], positive_label=1)
