import React, { useState } from "react";
import Page1 from "./Page1";
import CustomerDashboard from "./CustomerDashboard";

function App() {
  const [page, setPage] = useState(""); 

  const handlePageSelect = (selected) => {
    setPage(selected);
  };

  const handleBack = () => {
    setPage("");
  };

  // Home page with page choice
  if (!page) {
    return (
      <div style={styles.homeContainer}>
        <h1 style={styles.homeHeader}>Customer Churn Project</h1>
        <div style={styles.buttonBox}>
          <button
            style={styles.homeButton}
            onClick={() => handlePageSelect("page1")}
          >
            Predict Churn
          </button>
          <button
            style={{ ...styles.homeButton, background: "#28a745" }}
            onClick={() => handlePageSelect("dashboard")}
          >
            Customer Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Page1
  if (page === "page1") {
    return (
      <div>
        <button style={styles.backButton} onClick={handleBack}>
          ← Go Back
        </button>
        <Page1 />
      </div>
    );
  }

  // CustomerDashboard
  if (page === "dashboard") {
    return (
      <div>
        <button style={styles.backButton} onClick={handleBack}>
          ← Go Back
        </button>
        <CustomerDashboard />
      </div>
    );
  }
}

const styles = {
  homeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
    padding: "20px",
    textAlign: "center",
  },
  homeHeader: {
    fontSize: "3rem",
    marginBottom: "40px",
    color: "#1e1e1e",
    textShadow: "2px 2px 10px rgba(0,0,0,0.2)",
  },
  buttonBox: {
    display: "flex",
    gap: "30px",
  },
  homeButton: {
    padding: "20px 40px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    borderRadius: "50px",
    border: "none",
    cursor: "pointer",
    color: "white",
    background: "linear-gradient(90deg, #007bff, #00c6ff)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    transition: "0.3s all ease",
  },
  backButton: {
    margin: "20px",
    padding: "12px 25px",
    backgroundColor: "#ff6b6b",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    transition: "0.3s all ease",
  },
};

export default App;