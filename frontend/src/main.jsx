import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const initialForm = {
  age: 30,
  gender: "female",
  bmi: 30,
  bloodpressure: 95,
  diabetic: "No",
  children: 0,
  smoker: "No",
  region: "northeast",
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [prediction, setPrediction] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function estimateClaim(event) {
    event.preventDefault();
    setStatus("loading");
    setPrediction(null);
    setError("");

    const payload = {
      ...form,
      age: Number(form.age),
      bmi: Number(form.bmi),
      bloodpressure: Number(form.bloodpressure),
      children: Number(form.children),
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("The prediction service returned an error.");
      }

      const data = await response.json();
      if (!Number.isFinite(data.predicted_claim)) {
        throw new Error("The model returned an invalid claim value.");
      }

      setPrediction(data.predicted_claim);
      setStatus("success");
    } catch (requestError) {
      setStatus("error");
      setError(
        `${requestError.message} Make sure the FastAPI server is running on port 8000.`,
      );
    }
  }

  return (
    <main className="streamlit-page">
      <h1>Health Insurance Cost Predictor</h1>

      <form className="streamlit-form" onSubmit={estimateClaim}>
        <h2>Patient details</h2>

        <div className="streamlit-columns">
          <div className="field-column">
            <label>
              Age
              <input
                name="age"
                type="number"
                min="18"
                max="100"
                value={form.age}
                onChange={updateField}
                required
              />
            </label>
            <label>
              BMI{" "}
              <input
                name="bmi"
                type="number"
                min="10"
                max="70"
                step="0.1"
                value={form.bmi}
                onChange={updateField}
                required
              />
            </label>
            <label>
              Children
              <input
                name="children"
                type="number"
                min="0"
                max="10"
                value={form.children}
                onChange={updateField}
                required
              />
            </label>
            <label>
              Gender
              <select name="gender" value={form.gender} onChange={updateField}>
                <option>female</option>
                <option>male</option>
              </select>
            </label>
          </div>

          <div className="field-column">
            <label>
              Blood pressure
              <input
                name="bloodpressure"
                type="number"
                min="60"
                max="220"
                value={form.bloodpressure}
                onChange={updateField}
                required
              />
            </label>
            <label>
              Diabetic
              <select
                name="diabetic"
                value={form.diabetic}
                onChange={updateField}
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </label>
            <label>
              Smoker
              <select name="smoker" value={form.smoker} onChange={updateField}>
                <option>No</option>
                <option>Yes</option>
              </select>
            </label>
            <label>
              Region
              <select name="region" value={form.region} onChange={updateField}>
                <option>northeast</option>
                <option>northwest</option>
                <option>southeast</option>
                <option>southwest</option>
              </select>
            </label>
          </div>
        </div>

        <button
          className="streamlit-button"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Estimating..." : "Estimate claim"}
        </button>
        {status === "error" && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
      </form>

      {prediction !== null && (
        <section className="streamlit-result">
          <h2>Estimated claim</h2>
          <p className="streamlit-metric">
            $
            {prediction.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
