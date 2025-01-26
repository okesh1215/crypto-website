const express = require("express");
const router = express.Router();
const Wallet = require("../models/Wallet"); // Adjust the path as necessary
const authMiddleware = require("../middleware/auth"); // Middleware for authentication

// Generate a random wallet address using crypto
function generateWalletAddress() {
    const crypto = require('crypto');
    return crypto.randomBytes(16).toString('hex'); // Generates a 32-character hexadecimal string
  }
router.get("/wallet", authMiddleware, async (req, res) => {
    try {
      const userId = req.user?.id; // Get user ID from the authenticated token
  
      // Check if wallet exists
      let wallet = await Wallet.findOne({ user: userId });
  
      if (!wallet) {
        // Create wallet if not found
        const walletAddress = generateWalletAddress();  // This should be a valid, unique address
  
        wallet = new Wallet({
          user: userId,
          walletAddress: walletAddress,
          balance: 0,
          transactionHistory: [],
        });
  
        await wallet.save();
      }
  
      res.json(wallet); // Send wallet details
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  router.post("/buy", authMiddleware, async (req, res) => {
    const userId = req.user?.id;
    const { coinId, coinPrice, quantity } = req.body;
    console.log("coinname",coinId);
    console.log("coinprice",coinPrice);
    console.log("quantity",quantity)
  
    if (quantity <= 0) {
      return res.status(400).json({ error: "Invalid quantity." });
    }
  
    const totalCost = coinPrice * quantity;
  
    try {
      const wallet = await Wallet.findOne({ user: userId });
      if (!wallet) return res.status(404).json({ error: "Wallet not found." });
  
      if (wallet.balance < totalCost) {
        return res.status(400).json({ error: "Insufficient balance." });
      }
  
      // Deduct balance and add coins
      wallet.balance -= totalCost;
      const existingCoin = wallet.coins.find((coin) => coin.name === coinId);
  
      if (existingCoin) {
        existingCoin.quantity += quantity;
      } else {
        wallet.coins.push({ name: coinId, quantity });
      }
  
      // Record transaction history
      wallet.transactionHistory.push({
        type: "Debit",
        amount: totalCost,
        description: `Bought ${quantity} of ${coinId}`,
      });
  
      await wallet.save();
      res.json({ message: "Coins bought successfully!", wallet });
    } catch (error) {
      console.error("Error buying coins:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });
  
  // Sell coins
  router.post("/sell", authMiddleware, async (req, res) => {
    const userId = req.user?.id;
    const { coinId, coinPrice, quantity } = req.body;
    console.log("coinname",coinId);
    console.log("coinprice",coinPrice);

  
    if (quantity <= 0) {
      return res.status(400).json({ error: "Invalid quantity." });
    }
  
    const totalEarned = coinPrice * quantity;
  
    try {
      const wallet = await Wallet.findOne({ user: userId });
      if (!wallet) return res.status(404).json({ error: "Wallet not found." });
  
      const existingCoin = wallet.coins.find((coin) => coin.name === coinId);
      if (!existingCoin || existingCoin.quantity < quantity) {
        return res.status(400).json({ error: "Insufficient coins." });
      }
  
      // Deduct coins and add balance
      existingCoin.quantity -= quantity;
      wallet.balance += totalEarned;
  
      // Remove coin if quantity becomes zero
      if (existingCoin.quantity === 0) {
        wallet.coins = wallet.coins.filter((coin) => coin.name !== coinId);
      }
  
      // Record transaction history
      wallet.transactionHistory.push({
        type: "Credit",
        amount: totalEarned,
        description: `Sold ${quantity} of ${coinId}`,
      });
  
      await wallet.save();
      res.json({ message: "Coins sold successfully!", wallet });
    } catch (error) {
      console.error("Error selling coins:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });
  
  

router.post("/add", authMiddleware, async (req, res) => {
    try {
      const { amount } = req.body;
  
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
  
      const userId = req.user?.id;
  
      // Find wallet or create if it doesn't exist
      let wallet = await Wallet.findOne({ user: userId });
      if (!wallet) {
        wallet = new Wallet({
          user: userId,
          balance: 0,
          transactionHistory: [],
        });
      }
  
      // Update wallet balance and transaction history
      wallet.balance += amount;
      wallet.transactionHistory.push({
        type: "Credit",
        amount,
        date: new Date(),
        description: "Added funds",
      });
  
      await wallet.save(); // Save wallet to database
      res.json(wallet);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  router.post("/withdraw", authMiddleware, async (req, res) => {
    try {
      const { amount } = req.body;
  
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
  
      const userId = req.user?.id;
  
      // Find wallet or create if it doesn't exist
      let wallet = await Wallet.findOne({ user: userId });
      if (!wallet) {
        wallet = new Wallet({
          user: userId,
          balance: 0,
          transactionHistory: [],
        });
        await wallet.save();
      }
  
      // Check for sufficient balance
      if (wallet.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
  
      // Update wallet balance and transaction history
      wallet.balance -= amount;
      wallet.transactionHistory.push({
        type: "Debit",
        amount,
        date: new Date(),
        description: "Withdrew funds",
      });
  
      await wallet.save(); // Save wallet to database
      res.json(wallet);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.get("/transaction-history", authMiddleware, async (req, res) => {
    try {
      // Assuming the user ID is available in the request object (from authMiddleware)
      const userId = req.user?.id;
  
      // Fetch the wallet based on the user ID
      const wallet = await Wallet.findOne({ user: userId });
  
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
  
      // Send back the transaction history
      res.json(wallet.transactionHistory);
    } catch (err) {
      console.error("Error fetching transaction history:", err);
      res.status(500).json({ message: "Server error while fetching transaction history" });
    }
  });
  router.post('/update', authMiddleware, async (req, res) => {
    const { balance } = req.body;
    const userId = req.user?.id; // Ensure this comes from a valid token
    console.log(balance)
  
    console.log("Request payload:", { balance, userId }); // Debugging
  
    if (balance < 0) {
      return res.status(400).json({ message: "Balance cannot be negative" });
    }
  
    try {
      const updatedWallet = await Wallet.findOneAndUpdate(
        { user: userId }, // Corrected field name
        { balance },
        { new: true }
      );
  
      if (!updatedWallet) {
        console.log("Wallet not found for user ID:", userId); // Debugging
        return res.status(404).json({ message: "Wallet not found" });
      }
  
      res.status(200).json({ balance: updatedWallet.balance });
    } catch (err) {
      console.error("Error updating wallet:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  router.get("/coinsummary", authMiddleware, async (req, res) => {
    try {
      // Fetch the wallet associated with the authenticated user
      const wallet = await Wallet.findOne({ user: req.user?.id });
  
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" }); // Ensure this return stops further execution
      }
  
      // Map through the coins to only return the name and quantity
      const coinsWithPrices = wallet.coins.map((coin) => {
        return {
          name: coin.name,
          quantity: coin.quantity,
        };
      });
  
      // Send response only once
      return res.json({ coins: coinsWithPrices }); // Return response here
    } catch (err) {
      console.error(err.message);
      if (!res.headersSent) {
        res.status(500).send("Server error"); // Ensure headers are not already sent before responding
      }
    }
  });
  
 

  

module.exports = router;
