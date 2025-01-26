const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  walletAddress: { type: String, unique: true, required: true },
  balance: { type: Number, default: 0 },
  coins: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true, default: 0 },
    },
  ],
  transactionHistory: [
    {
      type: { type: String, enum: ["Credit", "Debit"], required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      description: { type: String },
    },
  ],
});


module.exports = mongoose.model("Wallet", WalletSchema);
