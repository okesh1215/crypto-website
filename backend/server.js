const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const Comment = require("./models/comment");
const Post = require("./models/post");
const Wallet=require("./models/Wallet")
const User = require("./models/user");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const mongourl = "mongodb+srv://okesh:21111512_Uk@cluster0.nl6ur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

// Connect to MongoDB using async/await
async function connectToDatabase() {
    try {
        await mongoose.connect(mongourl);
        console.log("Database connected!");
    } catch (err) {
        console.error("Database connection error:", err.message);
    }
}

connectToDatabase();

// Routes
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, "build", "index.html")));
app.use("/register", require('./routes/userRoutes'));
app.use("/login", require("./routes/LoginRoute"));
app.use("/watchlist", require("./routes/watchlistroutes"));
app.use("/discussion", require("./routes/postRoutes"));
app.use("/comment", require("./routes/commentRoutes"));
app.use("/subscription",require("./routes/subscriptionRoutes"));
app.use("/wallet",require("./routes/wallet"));

app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, "build", "index.html")));

// Start the server
app.listen(process.env.PORT || 5000, process.env.IP, function () {
    console.log('Crpytex has started');
});
