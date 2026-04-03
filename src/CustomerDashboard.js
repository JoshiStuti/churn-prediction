import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const BASE_URL = "http://127.0.0.1:5000";

function CustomerDashboard() {
  const [customerId, setCustomerId] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchCustomer = async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/customer/${customerId}`);
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        setCustomerData(null);
      } else {
        setCustomerData(data);
      }
    } catch (err) {
      alert("Error connecting to backend!");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Customer Dashboard</h2>
      <div style={styles.card}>
        <input type="text" placeholder="Enter Customer ID" value={customerId} onChange={(e) => setCustomerId(e.target.value)} style={styles.input} />
        <button onClick={handleFetchCustomer} style={styles.button}>{loading ? "Fetching..." : "Fetch Customer"}</button>
      </div>

      {customerData && (
        <div style={styles.dashboard}>
          <div style={styles.infoCard}>
            <h3>Customer Info</h3>
            <p><strong>Customer ID:</strong> {customerData.customer.customerID}</p>
            <p><strong>Tenure:</strong> {customerData.customer.tenure} months</p>
            <p><strong>Monthly Charges:</strong> ${customerData.customer.MonthlyCharges}</p>
            <p><strong>Total Charges:</strong> ${customerData.customer.TotalCharges}</p>
            <p><strong>Contract:</strong> {customerData.customer.Contract}</p>
            <p><strong>Internet Service:</strong> {customerData.customer.InternetService}</p>
            <p><strong>Payment Method:</strong> {customerData.customer.PaymentMethod}</p>
            <p><strong>Paperless Billing:</strong> {customerData.customer.PaperlessBilling}</p>
            <h3>Prediction: {customerData.prediction === "Churn" ? <span style={{color: "red"}}>❌ Churn</span> : <span style={{color: "green"}}>✅ Stay</span>}</h3>
          </div>

          <div style={styles.chartCard}>
            <h3>Charges Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ name: "Customer", MonthlyCharges: customerData.customer.MonthlyCharges, TotalCharges: customerData.customer.TotalCharges }]} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="MonthlyCharges" fill="#8884d8" />
                <Bar dataKey="TotalCharges" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: "'Segoe UI', sans-serif", padding: "20px", textAlign: "center", background: "linear-gradient(135deg, #fceabb 0%, #f8b500 100%)", minHeight: "100vh" },
  header: { fontSize: "2.5rem", marginBottom: "30px", color: "#333", textShadow: "1px 1px 5px rgba(0,0,0,0.2)" },
  card: { background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "inline-block", marginBottom: "30px" },
  input: { padding: "10px 15px", borderRadius: "10px", border: "1px solid #ccc", marginRight: "10px", width: "250px", fontSize: "1rem" },
  button: { padding: "10px 20px", borderRadius: "50px", border: "none", cursor: "pointer", fontWeight: "bold", color: "white", background: "linear-gradient(90deg, #ff416c, #ff4b2b)", boxShadow: "0 5px 15px rgba(0,0,0,0.3)", transition: "0.3s all ease" },
  dashboard: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "30px" },
  infoCard: { background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", width: "350px", textAlign: "left" },
  chartCard: { background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", width: "500px" }
};

export default CustomerDashboard;