const express = require("express");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.post("/subscribe", authMiddleware, async (req, res) => {
    // Access the userId from the decoded JWT (req.user.User.id)
    console.log("Decoded user data from token:", req.user);
    


    const userId = req.user?.id; // Checking if 'User' exists in the decoded JWT
    console.log("User ID extracted from token:", userId);

    if (!userId) {
        return res.status(401).json({ msg: 'User not found in token' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { subscriptionType } = req.body;

        // Update the user's subscriptionType
        user.subscriptionType = subscriptionType;
        await user.save();

        res.json({ message: `Successfully upgraded to ${subscriptionType} plan!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating subscription" });
    }
});
router.get('/current', authMiddleware, async (req, res) => {
    try {
        // Extract user ID from the token payload
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ msg: "User not authenticated" });
        }

        // Query the database to find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Return the user's subscription type
        res.json({ subscriptionType: user.subscriptionType || "Free Plan" });
    } catch (err) {
        console.error("Error fetching subscription type:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});


module.exports = router;
