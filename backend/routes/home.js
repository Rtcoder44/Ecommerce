const express = require("express");
const router = express.Router();
const data = require("../model/data"); 
const auth = require("../middleware/auth");


router.get("/", async (req, res) => {
    try {
        const products = await data.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await data.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch product" });
    }
});


router.post("/", auth, async (req, res) => {
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
        
    } catch (error) {
        res.status(500).json({ error: "Failed to add product" });
    }
});

module.exports = router;
