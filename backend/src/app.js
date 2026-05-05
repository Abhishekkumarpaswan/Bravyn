const express = require("express");
const cors = require("cors");
const CookieParser = require("cookieparser");

const app = express();
const allowedOrigins = (
  process.env.FRONTEND_URL?.split(",").map((origin) => origin.trim()) || [
    "http://localhost:5173",
    "http://localhost:4173",
  ]
).filter(Boolean);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  }),
); // Enable CORS for all origins

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use((req, _, next) => {
  req.cookies = req.headers.cookie
    ? CookieParser.parse(req.headers.cookie)
    : {};

  next();
});

// API Endpoint to get all products
const productRouter = require("./routes/products.routes");
app.use("/api/products", productRouter);

//API Endpoint to handle user authentication
const userRouter = require("./routes/user.routes");
app.use("/api/users", userRouter);

//API Endpoint to handle orders
const orderRouter = require("./routes/order.routes");
app.use("/api/orders", orderRouter);

module.exports = app;
