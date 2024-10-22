const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    items: [{
        productName: String,
        productDescription: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        imageUrl: String,
    }],
});

module.exports = mongoose.model("Cart", cartSchema);