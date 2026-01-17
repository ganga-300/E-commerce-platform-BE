const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    console.log("DEBUG: createOrder called with body:", req.body);
    try {
        const { amount, currency = "INR", receipt } = req.body;

        if (amount === undefined || amount === null || amount <= 0) {
            console.error("DEBUG: Invalid amount received:", amount);
            return res.status(400).json({ message: "Invalid amount. Amount must be greater than 0." });
        }

        const options = {
            amount: Math.round(parseFloat(amount) * 100), // Razorpay expects amount in paise (must be integer)
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error("Razorpay Order Error Details:", {
            message: error.message,
            stack: error.stack,
            code: error.code,
            metadata: error.metadata
        });
        res.status(500).json({
            message: "Failed to create Razorpay order",
            error: error.message,
            code: error.code
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Here you would typically update the order status in your database
            res.status(200).json({ message: "Payment verified successfully", success: true });
        } else {
            res.status(400).json({ message: "Invalid payment signature", success: false });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
