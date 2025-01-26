const jwt = require("jsonwebtoken"); // Make sure you have jwt imported
const User = require("../models/user");

const checkSubscription = (requiredLevel) => {
    return async (req, res, next) => {
        try {
            // Check if the authorization header is present
            const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "No token provided" });
            }

            // Verify JWT
            const decoded = jwt.verify(token, "your_jwt_secret");
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            // Define subscription levels in order of priority
            const levels = ["Free", "Basic", "Premium"];
            const userLevelIndex = levels.indexOf(user.subscriptionLevel);
            const requiredLevelIndex = levels.indexOf(requiredLevel);

            // Check if the user's subscription level is sufficient
            if (userLevelIndex < requiredLevelIndex) {
                return res.status(403).json({ message: "Insufficient subscription level" });
            }

            // Attach the user object to the request for future use
            req.user = user;
            next();
        } catch (err) {
            // Handle specific errors for JWT or database access issues
            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({ message: "Invalid token" });
            }
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };
};

module.exports = checkSubscription;
