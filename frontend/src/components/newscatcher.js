import React, { useEffect, useState } from "react";
import NewsCatcherItem from "./NewsCatcherItem";
import SweetAlert from "sweetalert2"; // SweetAlert for alerts
import "./newscatcher.css";
import axios from "axios";

const NewsCatcher = () => {
  const [mywatchlistarray, setWatchList] = useState([]); // User's watchlist
  const [responseData, setResponseData] = useState([]); // News data
  const [subscriptionType, setSubscriptionType] = useState(""); // Track user's subscription type
  const [alertDisplayed, setAlertDisplayed] = useState(false); // Prevent multiple alerts
  const [selectedItem, setSelectedItem] = useState(null); // Track selected watchlist item

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");

  const headers = {
    "Content-Type": "application/json",
    "x-auth-token": token || "",
    userid: userid || "",
  };

  // Fetch subscription type
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!token) {
        SweetAlert.fire({
          title: "Not Logged In",
          text: "Please log in to access this feature.",
          icon: "error",
          confirmButtonText: "Log In",
        }).then(() => {
          window.location.href = "/login";
        });
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/subscription/current", {
          headers: { "x-auth-token": token },
        });
        setSubscriptionType(response.data.subscriptionType || "Free Plan");
      } catch (error) {
        console.error("Failed to fetch subscription:", error.response || error.message);
        SweetAlert.fire({
          title: "Error",
          text: "Failed to load your subscription. Please try again later.",
          icon: "error",
        });
      }
    };

    fetchSubscription();
  }, []);

  // Display upgrade alert if subscription is not Premium
  useEffect(() => {
    if (subscriptionType && subscriptionType !== "Premium" && !alertDisplayed) {
      setAlertDisplayed(true);
      SweetAlert.fire({
        title: "Upgrade Your Subscription",
        text: "To access this feature, please upgrade to Premium.",
        icon: "warning",
        confirmButtonText: "Upgrade Now",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/subscription";
        }
      });
    }
  }, [subscriptionType, alertDisplayed]);

  // Fetch watchlist and news
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (subscriptionType === "Premium") {
          // Fetch watchlist
          const watchlistResponse = await fetch("http://localhost:5000/watchlist", {
            method: "GET",
            headers,
          });

          if (!watchlistResponse.ok) {
            throw new Error(`Failed to fetch watchlist: ${watchlistResponse.statusText}`);
          }

          const watchlistData = await watchlistResponse.json();
          setWatchList(watchlistData);

          // Fetch news for all watchlist items initially
          if (watchlistData.length > 0) {
            fetchNews(watchlistData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [subscriptionType]); // Dependency on subscriptionType

  // Fetch news for selected item or all items
  const fetchNews = async (items) => {
    try {
      const newsPromises = items.map((item) =>
        fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            item
          )}&apiKey=d59144528f254c408c66c500e61bb53e`
        )
      );

      const newsResponses = await Promise.all(newsPromises);

      const allArticles = [];
      for (const newsResponse of newsResponses) {
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();

          // Filter articles for this month only
          const filteredArticles = newsData.articles.filter((article) => {
            const articleDate = new Date(article.publishedAt);
            const now = new Date();
            return (
              articleDate.getFullYear() === now.getFullYear() &&
              articleDate.getMonth() === now.getMonth()
            );
          });

          allArticles.push(...filteredArticles);
        } else {
          console.error(`Failed to fetch news for an item: ${newsResponse.statusText}`);
        }
      }

      setResponseData(allArticles);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  // Handle click on a watchlist item
  const handleItemClick = (item) => {
    setSelectedItem(item);
    fetchNews([item]); // Fetch news only for the selected item
  };

  return (
    <div className="newscatcher">
      {subscriptionType === "Premium" ? (
        <>
          {/* Watchlist Section */}
          <div className="watchlist">
            <h4>Your Watchlist</h4>
            {mywatchlistarray.length > 0 ? (
              <ul>
                {mywatchlistarray.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleItemClick(item)}
                    style={{
                      cursor: "pointer",
                      fontWeight: selectedItem === item ? "bold" : "normal",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items in your watchlist.</p>
            )}
          </div>

          {/* News Section */}
          <div className="news-items">
            <NewsCatcherItem responseData={responseData} />
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default NewsCatcher;
