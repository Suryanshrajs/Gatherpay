import Razorpay from "razorpay";
import { createHmac } from "crypto";
import dotenv from "dotenv";
import Event from "../Models/Event.model.js";


dotenv.config({ path: "./.env" });

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createOrder(req, res) {
  try {
    const { amount, currency = "INR" } = req.body;

    const options = {
      amount: amount * 100,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Order creation failed", error });
  }
}

export async function verifyPayment(req, res) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    eventId,
    userId,
    amount,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const alreadyContributed = event.contributions.some((c) =>
      c.user.toString() === userId
    );

    if (!alreadyContributed) {
      event.contributions.push({
        user: userId,
        amount,
        paymentStatus: "completed",
        paymentDate: new Date(),
      });

      await event.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and contribution saved",
    });
  } catch (err) {
    console.error("Error verifying payment:", err);
    return res.status(500).json({
      success: false,
      message: "Server error verifying payment",
      error: err.message,
    });
  }
}
