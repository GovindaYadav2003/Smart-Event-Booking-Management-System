const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ================= 1. DATABASE CONNECTION =================
mongoose.connect("mongodb://127.0.0.1:27017/eventsDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ================= 2. MODELS =================
const Event = mongoose.model("Event", new mongoose.Schema({
  name: String,
  date: String
}));

const Payment = mongoose.model("Payment", new mongoose.Schema({
  event: String,
  paymentId: String,
  date: { type: Date, default: Date.now }
}));

// ================= 3. RAZORPAY CONFIG =================
const razorpay = new Razorpay({
  key_id: "rzp_test_SZsdRrAIjWC1TS", 
  key_secret: "OPN6RZhrT2LhgRGZLqtz1hl0" // 👈 PASTE SECRET HERE (No spaces!)
});

// ================= 4. ROUTES =================

// Get all events
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Create Order (The logic you shared)
app.post("/create-order", async (req, res) => {
  console.log("📩 Order Request Received");
  try {
    const options = {
      amount: 50000, // ₹500
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Order Created:", order.id);
    res.json(order); // Sends JSON back to React

  } catch (err) {
    console.error("❌ RAZORPAY ERROR:", err);
    // Always return JSON to avoid "Unexpected token E" in React
    res.status(500).json({ 
        error: "Razorpay order creation failed", 
        message: err.description || err.message 
    });
  }
});

// Save successful payment
app.post("/payment", async (req, res) => {
  const { event, paymentId } = req.body;
  try {
    const newPayment = await Payment.create({ event, paymentId });
    console.log("💾 Payment stored in DB");
    res.status(201).json(newPayment);
  } catch (err) {
    console.error("❌ DB Save Error:", err);
    res.status(500).json({ error: "Could not save payment" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));