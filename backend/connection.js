const mongoose = require("mongoose");

const connectToDb = async(url)=>{
await mongoose.connect(url)
.then(()=> console.log("mongodb is connected successfully"))
.catch((err)=>console.log("error while connecting with database"))
};

module.exports = {connectToDb};