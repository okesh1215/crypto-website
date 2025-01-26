import React from "react";
import { useHistory } from "react-router-dom";

const Welcome = () => {
  const history = useHistory();

  const handleGetStarted = () => {
    history.push("/register");
  };

  // Define inline styles
  const styles = {
    body: {
      fontFamily: "'Poppins', sans-serif",
      margin: 0,
      padding: 0,
      background: "linear-gradient(to bottom right, #1b2735, #090a1a)",
      color: "white",
      overflowX: "hidden",
    },
    container: {
      textAlign: "center",
      padding: "20px",
      maxWidth: "1200px",
      margin: "0 auto",
      borderRadius: "10px",
      backdropFilter: "blur(5px)",
    },
    header: {
      background: "linear-gradient(45deg, #020024, #090979, #00d4ff)",
      backgroundSize: "300% 300%",
      animation: "gradient-animation 5s ease infinite",
      color: "white",
      padding: "40px 20px",
      borderRadius: "15px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    },
    headerTitle: {
      fontSize: "2.8em",
      margin: 0,
      fontWeight: 600,
    },
    headerSubtitle: {
      fontSize: "1.3em",
      marginTop: "10px",
      opacity: 0.9,
    },
    section: {
      marginTop: "30px",
    },
    sectionTitle: {
      fontSize: "2em",
      color: "#00d4ff",
      marginBottom: "20px",
      textTransform: "uppercase",
      fontWeight: 600,
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "25px",
    },
    featureCard: {
      background: "rgba(0, 0, 0, 0.6)",
      borderRadius: "10px",
      padding: "25px",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.4)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      overflow: "hidden",
    },
    featureCardHover: {
      transform: "translateY(-10px)",
      boxShadow: "0 12px 25px rgba(0, 0, 0, 0.6)",
    },
    featureTitle: {
      fontSize: "1.6em",
      color: "#00d4ff",
      marginBottom: "10px",
      fontWeight: 600,
    },
    featureDescription: {
      fontSize: "1em",
      color: "#d4d4d4",
    },
    footer: {
      marginTop: "40px",
      padding: "30px",
      background: "linear-gradient(to right, #212529, #343a40)",
      borderRadius: "10px",
      color: "#ddd",
      textAlign: "center",
    },
    footerText: {
      fontSize: "1.2em",
      marginBottom: "20px",
    },
    button: {
      padding: "12px 25px",
      background: "linear-gradient(45deg, #6a11cb, #2575fc)",
      color: "white",
      border: "none",
      borderRadius: "25px",
      fontSize: "1em",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    },
    buttonHover: {
      transform: "scale(1.1)",
      background: "linear-gradient(45deg, #2575fc, #6a11cb)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>
          Welcome to <span style={{ color: "#00d4ff" }}>CryptoApp</span>
        </h1>
        <p style={styles.headerSubtitle}>
          Your all-in-one platform for crypto enthusiasts.
        </p>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Explore Our Features</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>📈 Watchlist</h3>
            <p style={styles.featureDescription}>
              Track your favorite cryptocurrencies in real time.
            </p>
          </div>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>🔔 Subscription</h3>
            <p style={styles.featureDescription}>
              Get instant news of your watchlists and build connections with
              other crypto users.
            </p>
          </div>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>💰 Wallet</h3>
            <p style={styles.featureDescription}>
              Manage your funds securely and conveniently.
            </p>
          </div>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>📰 News</h3>
            <p style={styles.featureDescription}>
              Stay updated with the latest crypto news and analysis.
            </p>
          </div>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>📝 Posts</h3>
            <p style={styles.featureDescription}>
              Share insights and engage with other crypto enthusiasts.
            </p>
          </div>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>💬 Forum</h3>
            <p style={styles.featureDescription}>
              Join discussions and connect with the crypto community.
            </p>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Ready to dive in? Sign up today and explore the future of crypto!
        </p>
        <button style={styles.button} onClick={handleGetStarted}>
          Get Started
        </button>
      </footer>
    </div>
  );
};

export default Welcome;
