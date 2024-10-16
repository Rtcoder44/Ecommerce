const express = require("express");
const app = express();
const port = 8080;
const cors = require('cors');
const Order = require("./model/order");
const data = require("./model/data");
const { connectToDb } = require("./connection");
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

app.listen(port, () => console.log(`App is listening on port ${port}`));

app.use(express.json());
app.use(cors());

connectToDb(mongoURI);


app.get("/", async (req, res) => {
    try {
        const products = await data.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});


app.post("/data", async (req, res) => {
    const { productName, productDiscription, imageUrl, price } = req.body;

    try {
        const newProduct = new data({
            productName,
            productDiscription,
            price,
            imageUrl
        });
        const saveProduct = await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: saveProduct });
        console.log(saveProduct);
    } catch (error) {
        res.status(500).json({ error: "Failed to add product" });
    }
});


app.post("/orders", async (req, res) => {
    const { cartItems } = req.body;

    try {
        const newOrder = new Order({
            items: cartItems,
            date: new Date()
        });
        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to place the order" });
    }
});
