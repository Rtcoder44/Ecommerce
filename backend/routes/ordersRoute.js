
const express = require("express");
const router = express.Router();
const Order = require("../model/order"); 
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
    const { cartItems } = req.body;
    const userId = req.user.id; 

    console.log("User ID:", userId); 
    console.log("Cart Items:", cartItems);  

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
        const orders = await Order.find({ userId }); 
        res.status(200).json(orders); 
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});
module.exports = router;
