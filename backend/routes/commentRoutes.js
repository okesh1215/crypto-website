var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Comment = require('../models/comment');
const Post = require('../models/post');
const authMiddleware = require("../middleware/auth");
// Helper function to check subscription
const checkSubscription = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user.subscriptionType;
};

// Create a new comment
router.post('/create', async (req, res) => {
    const userId = req.header('userid');
    const postId = req.header('postid');

    try {
        // Check the user's subscription
        const subscriptionType = await checkSubscription(userId);

        if (subscriptionType !== "Pro" && subscriptionType !== "Premium") {
            return res.status(403).send("Upgrade to Pro plan to comment on posts.");
        }

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Create the comment
        const comment = new Comment(req.body);
        comment.author.id = userId;
        comment.author.username = (await User.findById(userId)).name;  // Fetch user name
        comment.post.id = postId;

        await comment.save();
        post.comments.push(comment);
        await post.save();

        res.status(200).send("Comment created and linked to user and post");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message || "Error creating comment");
    }
});

// Get comments for a specific post
router.get('/getcomments', async (req, res) => {
    const postId = req.header('postid');

    try {
        const post = await Post.findById(postId).populate("comments");
        if (!post) {
            return res.status(404).send("Post not found");
        }

        res.status(200).send(post.comments);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message || "Error fetching comments");
    }
});

router.put('/editcomment', authMiddleware , async (req, res) => {
    const userId = req.user?.id;// Extracted from token
    const { commentid, commentauthorid } = req.headers;

    if (userId !== commentauthorid) {
        return res.status(403).send('Unauthorized to edit this comment.');
    }

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            commentid,
            { text: req.body.text },
            { new: true, runValidators: true }
        );

        if (!updatedComment) {
            return res.status(404).send('Comment not found.');
        }

        res.status(200).send('Comment updated.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating comment.');
    }
});

// Delete a comment
router.delete('/deletecomment', authMiddleware , async (req, res) => {
    const userId = req.user?.id;// Extracted from token
    const { commentid, commentauthorid } = req.headers;

    if (userId !== commentauthorid) {
        return res.status(403).send('Unauthorized to delete this comment.');
    }

    try {
        const foundComment = await Comment.findByIdAndDelete(commentid);

        if (!foundComment) {
            return res.status(404).send('Comment not found.');
        }

        res.status(200).send('Comment deleted.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting comment.');
    }
});

module.exports = router;
