var express = require('express');
const auth = require('../middleware/auth');
var router = express.Router();
const User = require('../models/user');

// PUT request to update user's watchlist
router.put("/", auth, async (req, res) => {
    const userId = req.header('userid');
    console.log("user id is " + userId);

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { "mywatchlist": req.body.mywatchlist } },
            { new: true } // Returns the updated document
        ).exec();

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).send(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while updating the watchlist");
    }
});

// GET request to retrieve user's watchlist
router.get("/", auth, async (req, res) => {
    const userId = req.header('userid');

    try {
        const user = await User.findById(userId).exec();

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send(user.mywatchlist);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while retrieving the watchlist");
    }
});

module.exports = router;
