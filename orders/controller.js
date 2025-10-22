const { createOrder, getOrderByUserId } = require("../services/orderService");


async function createNewOrder(req, res) {
  try {
    const userId = req.body.userId;
    const items = req.body.items; 

    const order = await createOrder(userId, items);
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
}


async function getUserOrders(req, res) {
  try {
    const userId = req.params.userId;
    const orders = await getOrderByUserId(userId);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

module.exports = { createNewOrder, getUserOrders };
