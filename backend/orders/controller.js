const { placeOrder, viewOrdersByUserId } = require("./service.js");

async function placeUserOrder(req, res) {
  const { userId } = req.params;
  const { items, shippingDetails, paymentDetails } = req.body;
  try {
    const order = await placeOrder(userId, items, shippingDetails, paymentDetails);
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function getUserOrders(req, res) {
  const { userId } = req.params;
  try {
    const orders = await viewOrdersByUserId(userId);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}

module.exports = { placeUserOrder, getUserOrders };
