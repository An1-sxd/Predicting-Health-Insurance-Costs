# Predicting Health Insurance Costs

Machine learning project for predicting health insurance claims, with a **FastAPI REST API**, a **Streamlit interface**, and a **React frontend**.

## Dataset

- 1,340 patient records
- 8 prediction features: `age`, `gender`, `bmi`, `bloodpressure`, `diabetic`, `children`, `smoker`, `region`
- Target: `claim`, the predicted insurance claim amount
- Dataset file: `data/insurance.csv`

The dataset is included in this project for training and local testing.

## ML Workflow

- Exploratory data analysis using Pandas
- Train/test split with a fixed random state
- Numerical preprocessing with mean imputation and `StandardScaler`
- Categorical preprocessing with most-frequent imputation and `OneHotEncoder`
- Combined preprocessing using `ColumnTransformer`
- Target transformation using `log1p(claim)` to handle the skewed claim distribution
- Random Forest regression inside a Scikit-learn `Pipeline`
- Hyperparameter tuning with `RandomizedSearchCV`
- Predictions converted back to claim units with `expm1`
- Model saved with Joblib

## API

FastAPI endpoint:

```text
POST /predict
```

The API receives patient information and returns a predicted claim amount:

```json
{
  "age": 30,
  "gender": "female",
  "bmi": 30.0,
  "bloodpressure": 95,
  "diabetic": "No",
  "children": 0,
  "smoker": "No",
  "region": "northeast"
}
```

Response:

```json
{
  "predicted_claim": 5651.49
}
```

Swagger documentation is available at `/docs` when the API is running.

## Interfaces

### Streamlit

The Streamlit app provides a simple form for entering patient details and viewing the predicted claim.

```text
streamlit_app.py
```

### React

The React frontend provides the same patient form and communicates with the FastAPI backend.

```text
frontend/
```

## Project Structure

```text
Predicting Health Insurance Costs/
├── api/
│   └── main.py
├── data/
│   └── insurance.csv
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── model/
│   └── model.pkl
├── notebook/
│   ├── train.ipynb
│   └── train_v2.ipynb
├── streamlit_app.py
├── .gitignore
└── README.md
```

## Run Locally

From the project directory, install the Python dependencies:

```bash
pip install fastapi uvicorn pydantic joblib numpy pandas scikit-learn streamlit
```

### Start the API

```bash
uvicorn api.main:app --reload --port 8000
```

Open Swagger:

```text
http://127.0.0.1:8000/docs
```

### Start the Streamlit app

In a second terminal:

```bash
streamlit run streamlit_app.py
```

Open the Streamlit interface:

```text
http://localhost:8501
```

### Start the React app

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the React interface:

```text
http://localhost:5173
```

The FastAPI server must be running on port `8000` for predictions from the React frontend.

## Tech Stack

Python · Pandas · NumPy · Scikit-learn · FastAPI · Pydantic · Joblib · Streamlit · React · Vite
