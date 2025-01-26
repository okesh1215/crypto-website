const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const authMiddleware = require("../middleware/auth");
// New discussion
router.post('/create', async (req, res) => {
    try {
        const userId = req.header('userid');
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const post = await Post.create(req.body.post);
        post.author.id = userId;
        post.author.username = user.name;
        await post.save();

        user.posts.push(post);
        await user.save();

        res.status(200).send("Discussion created and linked to user");
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Show all posts
router.get('/allposts', async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ date: -1 });
        res.status(200).send(posts);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});
router.get("/userposts", async (req, res) => {
    const { username } = req.query;
  
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
  
    try {
      // Query posts by author's username (author.username is the field you need to match)
      const userPosts = await Post.find({ "author.username": username });
      console.log(userPosts)
  
      if (userPosts.length === 0) {
        return res.status(404).json({ message: "No posts found for the user" });
      }
  
      res.status(200).json(userPosts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user posts", error });
    }
  });
// Show current user posts
router.get('/myposts', async (req, res) => {
    try {
        const userId = req.header('userid');
        const user = await User.findById(userId).populate("posts");
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(user.posts);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Show post by ID
router.get('/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate("comments");
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.status(200).send(post);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Edit post
router.put('/editpost', authMiddleware, async (req, res) => {
    const { userId, postId, postauthorid } = req.body;
    try {
        if (userId === postauthorid) {
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    Heading: req.body.Heading,
                    description: req.body.description,
                },
                { new: true }
            );

            if (!updatedPost) {
                return res.status(404).send("Post not found");
            }
            res.status(200).send("Post updated");
        } else {
            res.status(403).send("Unauthorized action");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});
// Delete post
router.delete('/deletepost', authMiddleware, async (req, res) => {
    const { userId, postId, postauthorid } = req.body;

    try {
        // Verify the user ID matches the one from the JWT token
        if (req.user.id !== userId) {
            return res.status(403).json({ msg: 'Unauthorized action' });
        }

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Verify the post author
        if (post.author.id.toString() !== postauthorid) {
            return res.status(403).json({ msg: 'You are not the author of this post' });
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ msg: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});


module.exports = router;
