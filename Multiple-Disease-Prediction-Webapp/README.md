# Multiple Disease Prediction Webapp

> **Abstract** : The designed web app employs the Streamlit Python library for frontend design and communicates with backend ML models to predict the probability of diseases. Multiple Disease Prediction has many machine learning models used in prediction. We will be able to choose the diseases from the navigation bar or a sidebar for which we want to make a prediction using various input values. These input values will be the symptoms, physical health data, or blood test results. We will first trained our model from historic data, so it can make accurate predictions. It's capable of predicting whether someone has Diabetes, Heart issues, Parkinson's, Liver conditions, Hepatitis, Jaundice, and more based on the provided symptoms, medical history, and results.

### Project Members

1. Shobhit mishra
2. Arpit Chaurasia
3. Kartik gupta

### Deployment Steps

Please follow the below steps to run this project.
<br>

1. `pip install -r Frontend/requirements.txt`<br>
2. `pip install -r Frontend/requirements-grok.txt`<br>
3. Paste your Groq key in `Frontend/.env` as `GROQ_API_KEY=your_key_here`<br>
4. `cd Frontend`<br>
5. `streamlit run app.py`<br><br>

### Groq Agent Description Layer

- The Disease Prediction page includes a `Groq Agent Description` tab.
- It uses Groq's direct Chat Completions API in a two-step agent flow, where one agent drafts triage notes and a second agent rewrites them into a patient-friendly explanation.
- The app reads `GROQ_API_KEY` and `GROQ_MODEL` from `Frontend/.env`.
- If the key is missing, the rest of the app still works and the Groq tab shows setup guidance.

### Platform, Libraries and Frameworks used

1. [Streamlit](https://docs.streamlit.io/library/get-started)
2. [Python](https://www.python.org)
3. [Sklearn](https://scikit-learn.org/stable/index.html)

### Dataset Used

1. [Diabetes disease dataset](https://www.kaggle.com/datasets/mathchi/diabetes-data-set/data)
2. [Heart disease dataset](https://www.kaggle.com/datasets/rishidamarla/heart-disease-prediction/data)
3. [Parkinsons disease dataset](https://www.kaggle.com/code/arunkumarpyramid/detection-parkinson-s-disease/data)
4. [Liver disease dataset](https://www.kaggle.com/code/harisyammnv/liver-disease-prediction/data)
5. [Hepatities disease dataset](https://kaggle.com/dataset2)
6. [Jaundice disease dataset](https://kaggle.com/dataset2)

<br></br>

### References

- [1] Priyanka Sonar, Prof. K. Jaya Malini,” DIABETES PREDICTION USING DIFFERENT MACHINE LEARNING APPROACHES”, 2019 IEEE ,3rd International Conference on Computing Methodologies and Communication (ICCMC)
- [2] Archana Singh, Rakesh Kumar, “Heart Disease Prediction Using Machine Learning Algorithms”, 2020 IEEE, International Conference on Electrical and Electronics Engineering (ICE3)
- [3] A. Sivasangari, Baddigam Jaya Krishna Reddy, Annamareddy Kiran, P. Ajitha,” Diagnosis of Liver Disease using Machine Learning Models” 2020 Fourth International Conference on I-SMAC (IoT in Social, Mobile, Analytics and Cloud) (I-SMAC)
