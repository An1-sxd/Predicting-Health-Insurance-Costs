from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from pathlib import Path


app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origin_regex=r"https?://(localhost|127\.0\.0\.1):(5173|5174|5175)",
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

class Patient(BaseModel):
  age : float
  gender : str
  bmi : float
  bloodpressure : int
  diabetic : str
  children : int
  smoker : str
  region : str

model_path = Path(__file__).resolve().parent.parent / "model" / "model.pkl"
model = joblib.load(model_path)

@app.post("/predict")
def predict(patient : Patient):

  features = pd.DataFrame([{      # we'll use dataframe because the <<pipeline>> expects <<pandas df>> !
    "age": patient.age,
    "gender": patient.gender,
    "bmi": patient.bmi,
    "bloodpressure": patient.bloodpressure,
    "diabetic": patient.diabetic,
    "children": patient.children,
    "smoker": patient.smoker,
    "region": patient.region
  }])

  prediction_log = model.predict(features)[0]
  if not np.isfinite(prediction_log) or prediction_log > 20:
    raise ValueError("The model returned an invalid prediction")

  prediction = max(0.0, np.expm1(prediction_log))

  return {"predicted_claim" : float(prediction)}

