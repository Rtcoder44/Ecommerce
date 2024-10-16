const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true,
    },
    productDiscription:{
        type: String,
    },
    imageUrl:{
        type: String,
    },
    price:{
        type:Number
    }

})

const data = mongoose.model("data", productSchema);
module.exports= data;