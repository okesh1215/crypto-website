import React, { useState, useEffect } from "react";
import axios from "axios";
import CoinList from "../components/CoinList";
import "./CoinSummaryPage.css";

const CoinSummaryPage = () => {
  const [coins, setCoins] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/wallet/coinsummary", {
          headers: {
            "x-auth-token": token,
          },
        });
        console.log(response);

        setCoins(response.data.coins || []); // Handle missing coins gracefully
      } catch (err) {
        console.error("Error fetching coin summary:", err);
        setError(err.response?.data?.message || "Failed to fetch coin summary.");
      }
    };

    fetchCoins();
  }, []);

  return (
    <div className="coinsummary shadow border p-2 rounded csp" style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
      <h1 style={{ textAlign: "center", color: "#333", fontSize: "2rem" }}>Data Summary</h1>
      {error && <p className="error-message" style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {!error && coins.length > 0 ? (
        <table
          className="coin-table"
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#343a40", color: "#fff", fontSize: "1.1rem" }}>
              <th style={{ padding: "12px 15px", textAlign: "center" }}>Coin</th>
              <th style={{ padding: "12px 15px", textAlign: "center" }}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f1f1f1" : "#ffffff" }}>
                <td style={{ padding: "12px 15px",textAlign: "center" }}>{coin.name}</td>
                <td style={{ padding: "12px 15px", textAlign: "center" }}>{coin.quantity}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#555" }}>No coins found in your wallet.</p>
      )}

      {/* Render CoinList component */}
      <CoinList />
    </div>
  );
};

export default CoinSummaryPage;
