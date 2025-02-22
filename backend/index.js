const express = require("express");
const cors = require("cors");
const { connectToDb } = require("./connection");
require("dotenv").config();
const auth = require("./middleware/auth");
const app = express();
const port = process.env.PORT || 8080;

const homeRoute = require("./routes/home");
const ordersRoute = require("./routes/ordersRoute");
const signupRoute = require("./routes/userRoutes/signup");
const loginRoute = require("./routes/userRoutes/login");
const cartRoutes = require("./routes/cart");

app.use(express.json());

// ✅ CORS Fix
app.use(
  cors({
    origin: [
      "https://rtcoder44.github.io",
      "https://ecommerce-p5mr.onrender.com",
      "http://localhost:5173", // ✅ Added Localhost for Development
    ],
    credentials: true,
  })
);

// ✅ Global Middleware to Set CORS Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*"); 
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

connectToDb(process.env.MONGO_URI).catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});

app.use("/", homeRoute);
app.use("/data", homeRoute);
app.use("/orders", ordersRoute);
app.use("/signup", signupRoute);
app.use("/login", loginRoute);
app.use("/cart", cartRoutes);

app.get("/protected", auth, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.listen(port, () => console.log(`App is listening on port ${port}`));
