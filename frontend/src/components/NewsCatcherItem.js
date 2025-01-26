import React from "react";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

const NewsCatcherItem = (props) => {
  const { responseData } = props;

  if (responseData.length > 0) {
    const rows = [];
    for (let i = 0; i < responseData.length; i += 4) {
      rows.push(responseData.slice(i, i + 4));
    }

    return (
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "20px",
          margin: "0 50px",
        }}
      >
        {rows.map((row, rowIndex) => (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              margin: "0 -10px",
            }}
            key={rowIndex}
          >
            {row.map((list, index) => (
              <div
                style={{
                  flex: "0 0 25%",
                  padding: "10px",
                  boxSizing: "border-box",
                }}
                key={`${rowIndex}-${index}`}
              >
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "15px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    height: "100%",
                  }}
                >
                  <img
                    src={
                      list.urlToImage ||
                      "https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                    }
                    alt="News"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                  <h4
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#333",
                      marginBottom: "10px",
                    }}
                  >
                    {list.title || "Untitled"}
                  </h4>
                  <h5
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <PlayArrowIcon
                      style={{ fontSize: "16px", marginRight: "5px" }}
                    />
                    {list.author || "Unknown Author"}
                  </h5>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#444",
                      lineHeight: "1.5",
                    }}
                  >
                    {list.description || "No description available."}
                  </p>
                  <a
                    href={list.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "14px",
                      color: "#007bff",
                      textDecoration: "underline",
                    }}
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  } else {
    return <h3>No news available</h3>;
  }
};

export default NewsCatcherItem;
