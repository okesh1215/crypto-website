import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./CoinData.css";

const CoinData = ({ data }) => {
  const [quantity, setQuantity] = useState(0);

  // Handle Buy action
  // Handle Buy action
const handleBuy = async () => {
  try {
    if (quantity <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: "Please enter a valid quantity.",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to continue.",
      });
      return;
    }

    const coinId = data.name;
    const coinPrice = data.current_price;

    const response = await axios.post(
      "http://localhost:5000/wallet/buy",
      {
        coinId,
        quantity,
        coinPrice,
        transactionType: "buy",
      },
      {
        headers: { 'x-auth-token': token },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Purchase Successful",
      text: `Successfully bought ${quantity} ${data.name}!`,
    });
    console.log("Buy response:", response.data);
  } catch (error) {
    console.error("Error buying crypto:", error);

    if (error.response && error.response.data.error === "Insufficient balance.") {
      Swal.fire({
        icon: "error",
        title: "Insufficient Balance",
        text: "You don't have enough funds in your wallet.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while processing your request.",
      });
    }
  }
};

// Handle Sell action
const handleSell = async () => {
  try {
    if (quantity <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: "Please enter a valid quantity.",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to continue.",
      });
      return;
    }

    const coinId = data.name;
    const coinPrice = data.current_price;

    const response = await axios.post(
      "http://localhost:5000/wallet/sell",
      {
        coinId,
        quantity,
        coinPrice,
        transactionType: "sell",
      },
      {
        headers: { 'x-auth-token': token },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Sell Successful",
      text: `Successfully sold ${quantity} ${data.name}!`,
    });
    console.log("Sell response:", response.data);
  } catch (error) {
    console.error("Error selling crypto:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while processing your request.",
      footer: error.response?.data?.error || "",
    });
  }
};


  const renderData = () => {
    if (data) {
      return (
        <div className="bg-white mt-3 p-2 rounded border row cd">
          <div className="col-sm">
            <div className="d-flex flex-column">
              <span className="text-muted coin-data-category">Market Cap</span>
              <span>{data.market_cap}</span>
            </div>
            <hr />
            <div className="d-flex flex-column">
              <span className="text-muted coin-data-category">Total Supply</span>
              <span>{data.total_supply}</span>
            </div>
          </div>

          <div className="col-sm">
            <div className="d-flex flex-column">
              <span className="text-muted coin-data-category">Volume(24H)</span>
              <span>{data.total_volume}</span>
            </div>
            <hr />
            <div className="d-flex flex-column">
              <span className="text-muted coin-data-category">High 24h</span>
              <span>{data.high_24h}</span>
            </div>
          </div>

          <div className="col-sm">
            <div className="d-flex flex-column">
              <span className="text-muted coin-data-category">Circulating Supply</span>
              <span>{data.circulating_supply}</span>
            </div>
            <hr />
            <div className="d-flex flex-column">
              <span className="text-muted coin-data-category">Low 24h</span>
              <span>{data.low_24h}</span>
            </div>
          </div>

          {/* Buy and Sell Section */}
          <div className="col-sm-12 mt-3">
            <div className="d-flex flex-column">
              <span className="text-muted">Quantity to Buy/Sell</span>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="amount-input"
              />
            </div>
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-success" onClick={handleBuy}>
                Buy
              </button>
              <button className="btn btn-danger" onClick={handleSell}>
                Sell
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  return <div>{renderData()}</div>;
};

export default CoinData;
