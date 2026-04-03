import React, { useState } from "react";

const BASE_URL = "http://127.0.0.1:5000";

function Page1() {
  const [formData, setFormData] = useState({
    tenure: "",
    MonthlyCharges: "",
    TotalCharges: "",
    Contract: "Month-to-month",
    InternetService: "DSL",
    PaymentMethod: "Electronic check",
    PaperlessBilling: "Yes"
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      alert("Error connecting to backend!");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Customer Churn Prediction</h2>
      <div style={styles.card}>
        <label>Tenure (months)</label>
        <input type="number" name="tenure" value={formData.tenure} onChange={handleChange} style={styles.input} />

        <label>Monthly Charges</label>
        <input type="number" name="MonthlyCharges" value={formData.MonthlyCharges} onChange={handleChange} style={styles.input} />

        <label>Total Charges</label>
        <input type="number" name="TotalCharges" value={formData.TotalCharges} onChange={handleChange} style={styles.input} />

        <label>Contract</label>
        <select name="Contract" value={formData.Contract} onChange={handleChange} style={styles.input}>
          <option>Month-to-month</option>
          <option>One year</option>
          <option>Two year</option>
        </select>

        <label>Internet Service</label>
        <select name="InternetService" value={formData.InternetService} onChange={handleChange} style={styles.input}>
          <option>DSL</option>
          <option>Fiber optic</option>
          <option>No</option>
        </select>

        <label>Payment Method</label>
        <select name="PaymentMethod" value={formData.PaymentMethod} onChange={handleChange} style={styles.input}>
          <option>Electronic check</option>
          <option>Mailed check</option>
          <option>Bank transfer (automatic)</option>
          <option>Credit card (automatic)</option>
        </select>

        <label>Paperless Billing</label>
        <select name="PaperlessBilling" value={formData.PaperlessBilling} onChange={handleChange} style={styles.input}>
          <option>Yes</option>
          <option>No</option>
        </select>

        <button onClick={handlePredict} style={styles.button}>{loading ? "Predicting..." : "Predict Churn"}</button>

        {prediction && (
          <h3 style={{ marginTop: "20px", color: prediction === "Churn" ? "red" : "green" }}>
            {prediction === "Churn" ? "❌ Churn" : "✅ Stay"}
          </h3>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
    textAlign: "center",
    background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
    minHeight: "100vh"
  },
  header: { fontSize: "2.5rem", marginBottom: "30px", color: "#1e1e1e", textShadow: "2px 2px 10px rgba(0,0,0,0.2)" },
  card: { display: "inline-block", background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" },
  input: { display: "block", width: "250px", padding: "10px", margin: "10px auto", borderRadius: "10px", border: "1px solid #ccc", fontSize: "1rem" },
  button: { marginTop: "20px", padding: "10px 20px", borderRadius: "50px", border: "none", cursor: "pointer", fontWeight: "bold", color: "white", background: "linear-gradient(90deg, #007bff, #00c6ff)", boxShadow: "0 5px 15px rgba(0,0,0,0.3)", transition: "0.3s all ease" },
};

export default Page1;