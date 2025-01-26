import React, { useEffect, useState } from "react";
import axios from "axios";
import './Wallet.css'; // Import the CSS file

const Wallet = () => {
  const [wallet, setWallet] = useState(null); // State to store wallet details
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for errors
  const [amount, setAmount] = useState(""); // State for input amount
  const [actionError, setActionError] = useState(null); // State for errors in add/withdraw actions
  const [showHistory, setShowHistory] = useState(false); // Toggle to show/hide transaction history

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem("token"); // Fetch the token from localStorage or any storage method
        if (!token) {
          throw new Error("Authentication token is missing or expired!");
        }

        const response = await axios.get("http://localhost:5000/wallet/wallet", {
          headers: {
            'x-auth-token': token,
          },
        });

        console.log("Wallet data:", response.data); // Log the response to verify data
        setWallet(response.data); // Update wallet state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching wallet:", err.response || err.message); // Log detailed error
        setError(err.response?.data?.message || "Something went wrong!");
        setLoading(false);
      }
    };

    fetchWallet();
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  // Add to wallet
  const addToWallet = async () => {
    setActionError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing!");

      const response = await axios.post(
        "http://localhost:5000/wallet/add",
        { amount: parseFloat(amount) }, // Only amount is passed
        {
          headers: {
            'x-auth-token': token, // Token identifies the user
          },
        }
      );

      console.log("Wallet updated:", response.data); // Log the response to verify data
      setWallet(response.data); // Update wallet details after adding funds
      setAmount(""); // Reset the input field
    } catch (err) {
      console.error("Error adding to wallet:", err.response || err.message); // Log detailed error
      setActionError(err.response?.data?.message || "Failed to add to wallet");
    }
  };

  // Withdraw from wallet
  const withdrawFromWallet = async () => {
    setActionError(null);
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Authentication token is missing!");

      const response = await axios.post(
        "http://localhost:5000/wallet/withdraw",
        { amount: parseFloat(amount) }, // Only amount is passed
        {
          headers: {
            'x-auth-token': token, // Token identifies the user
          },
        }
      );

      console.log("Wallet updated:", response.data); // Log the response to verify data
      setWallet(response.data); // Update wallet details after withdrawal
      setAmount(""); // Reset the input field
    } catch (err) {
      console.error("Error withdrawing from wallet:", err.response || err.message); // Log detailed error
      setActionError(err.response?.data?.message || "Failed to withdraw from wallet");
    }
  };

  // Loading or error messages
  if (loading) return <p className="wallet-loading">Loading wallet details...</p>;
  if (error) return <p className="wallet-error-message">Error: {error}</p>;

  // Ensure wallet data exists before rendering details
  if (!wallet) {
    return <p className="wallet-error-message">No wallet data available.</p>;
  }

  return (
    <div className="wallet-container">
  <h2 className="wallet-header">My Wallet</h2>

  <div className="wallet-details">
    <p><strong>Balance:</strong> {wallet.balance} USD</p>
  </div>

  <div className="wallet-actions">
    <h3>Manage Wallet</h3>
    <input
      type="number"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      placeholder="Enter amount"
      className="wallet-input"
    />
    <button
      onClick={addToWallet}
      className="wallet-button wallet-button-add"
    >
      Add
    </button>
    <button
      onClick={withdrawFromWallet}
      className="wallet-button wallet-button-withdraw"
    >
      Withdraw
    </button>
    {actionError && <p className="wallet-error">{actionError}</p>}
  </div>

  <div className="wallet-actions">
    <button
      onClick={() => setShowHistory(!showHistory)}
      className="wallet-button wallet-button-history"
    >
      {showHistory ? "Hide Transaction History" : "Show Transaction History"}
    </button>
  </div>

  {showHistory && (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      {wallet.transactionHistory && Array.isArray(wallet.transactionHistory) && wallet.transactionHistory.length > 0 ? (
        <ul>
          {wallet.transactionHistory.map((transaction, index) => (
            <li key={index}>
              <p><strong>{transaction.type}</strong> - Amount: {transaction.amount} USD</p>
              <p>{transaction.description}</p>
              <p><em>{new Date(transaction.date).toLocaleString()}</em></p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  )}
</div>

  );
};

export default Wallet;
