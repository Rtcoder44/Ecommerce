const express = require("express");
const cors = require("cors");
const { connectToDb } = require("./connection");
require("dotenv").config();

const app = express();
const port = 8080;

// Import routes
const homeRoute = require("./routes/home");
const ordersRoute = require("./routes/ordersRoute");
const signupRoute = require("./routes/userRoutes/signup");
const loginRoute = require("./routes/userRoutes/login");
const auth = require("./middleware/auth");
const cartRoutes = require("./routes/cart");


app.use(express.json());
app.use(cors());


connectToDb(process.env.MONGO_URI);


app.use("/", homeRoute);
app.use("/data", homeRoute);
app.use("/orders", ordersRoute);
app.use("/myorder", ordersRoute);
app.use("/signup", signupRoute);
app.use("/login", loginRoute);
app.use("/cart", cartRoutes);

app.get("/protected", auth, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});


app.listen(port, () => console.log(`App is listening on port ${port}`));
