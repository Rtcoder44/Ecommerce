const express = require("express");
const router = express.Router();
const Order = require("../model/order"); 
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
    const { cartItems } = req.body;
    const userId = req.user.id;

    try {
        const newOrder = new Order({
            userId,  
            items: cartItems,
            date: new Date()
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!" });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ error: "Failed to place the order" });
    }
});

router.get("/", auth, async (req, res) => {
    const userId = req.user.id;

    try {
        console.log(`Fetching orders for user: ${userId}`);  // Debugging

        const orders = await Order.find({ userId });
        
        if (!orders || orders.length === 0) {
            console.log(`No orders found for user: ${userId}`);
            return res.status(404).json({ error: "No orders found" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);  // Improved error logging
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

module.exports = router;
