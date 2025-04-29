
# Crypto Trading Platform

This project is a cryptocurrency trading platform developed using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The platform offers real-time cryptocurrency data, portfolio management, transaction history, and a news integration feature, all in one place.

## Features

- **Real-time Cryptocurrency Data**: Live prices and updates of various cryptocurrencies powered by the CoinGecko API.
- **Portfolio Management**: Track your cryptocurrency portfolio, view available coins, prices, and quantities.
- **User Authentication**: Secure login and registration system.
- **News Feed**: Integrated cryptocurrency news blogs to keep users updated on the latest developments.
- **Responsive Design**: A user-friendly and responsive UI that works seamlessly across devices.
- **Transaction History**: Users can view their transaction history related to crypto investments.
  
## Tech Stack

- **Frontend**: React.js for creating interactive UIs and handling user input.
- **Backend**: Node.js and Express.js to handle API requests and manage server-side logic.
- **Database**: MongoDB for storing transaction data, user profiles, and portfolio information.
- **APIs**: 
  - CoinGecko API for real-time cryptocurrency data.
  - News API for fetching cryptocurrency-related news articles.
  
## Installation

Follow the steps below to run the project locally:

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB (for local development) or use a cloud-based MongoDB service like MongoDB Atlas.

### Clone the Repository
```bash
git clone https://github.com/okesh1215/Crypto-Trading-Platform-MERN-Stack-with-Real-Time-Data-related-news-and-Social-Features.git

cd Crypto-Trading-Platform-MERN-Stack-with-Real-Time-Data-related-news-and-Social-Features
```

### Backend Setup
Install the dependencies for the backend:
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder and add the following:

```makefile
PORT=5000
MONGO_URI=<your_mongo_db_connection_string>
COINGECKO_API_KEY=<your_coingecko_api_key>
NEWS_API_KEY=<your_news_api_key>
```

Run the backend server:
```bash
npm start
```

### Frontend Setup
Install the dependencies for the frontend:
```bash
cd frontend
npm install
```

Run the frontend development server:
```bash
npm start
```

### Accessing the Platform
Once both the backend and frontend servers are running, open your browser and visit `http://localhost:3000` to access the application.

## Usage
- **Sign up / Log in**: Create an account or log in using the provided credentials.
- **Add Coins**: Add your preferred cryptocurrencies to your portfolio and track their prices.
- **View News**: Read the latest cryptocurrency news from integrated blog sources.
- **Manage Portfolio**: View your portfolio with available coins, quantities, and their real-time prices.
- **Track Transactions**: View your transaction history and manage your crypto investments.

## Future Improvements
- **AI-based Portfolio Management**: Implement machine learning models to suggest optimized portfolios.
- **Advanced Analytics**: Incorporate advanced data visualization tools to display price trends, predictions, and portfolio performance.
- **Mobile App**: Extend the platform with a mobile version for Android and iOS.

## Contributing
Feel free to fork the repository, make changes, and submit a pull request. Contributions are always welcome!
