const express = require("express");
const app = express();
const port = 8080;
const cors = require('cors');
const { connectToDb } = require("./connection");
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
const homeRoute = require("./routes/home");
const ordersRoute = require("./routes/ordersRoute");
const signup = require("./routes/userRoutes/signup");
const login = require("./routes/userRoutes/login");
const auth = require("./middleware/auth");

app.use(express.json());
app.use(cors());

connectToDb(mongoURI);

app.listen(port, () => console.log(`App is listening on port ${port}`));

app.use("/", homeRoute);
app.use("/data", homeRoute);
app.use("/orders", ordersRoute);
app.use("/myorder",ordersRoute);
app.use("/signup", signup);  
app.use("/login", login);  
app.get("/protected", auth, (req, res) => { 
    res.json({ message: "This is a protected route", user: req.user });
});