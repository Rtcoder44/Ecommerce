const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    items:[{
        productName:String,
        productDiscription:String,
        quantity:Number,
        price:Number,
        imageUrl:String,
    }],
    date:{
        type:Date,
        default:Date.now
    }
});

const Order = mongoose.model("order",orderSchema);
module.exports = Order;