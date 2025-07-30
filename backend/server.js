const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

app.use(express.json()); // TO know that data can come on JSON format to remove runtime Error.

// Importing Routes
const signUpRoute = require("./routes/signup");
const signInRoute = require("./routes/signin");
const referenceRoutes = require("./routes/referenceRoutes");
const forgotPasswordRoute = require("./routes/forgotPassword");

// Logging Middleware for Bonus Points
const loggingMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// Request Validation Middleware for Bonus Points
const validateRequest = (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is required",
      });
    }
  }
  next();
};

// Middleware for CORS
app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  })
);

// Apply middleware
app.use(loggingMiddleware);
app.use(validateRequest);

app.get("/status", (req, res) => {
  res.status(200).json({
    message: "active",
  });
});

app.use("/api", signUpRoute);
app.use("/api", signInRoute);
app.use("/api", referenceRoutes); // References routes
app.use("/api", forgotPasswordRoute);

// GLOBAL ERROR HANDLER MIDDLEWARE
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    details: err.details || null,
  });
});

const PORT = process.env.PORT || 4936;
app.listen(PORT, (err) => {
  console.log("Server running on PORT", PORT);
  if (err) {
    console.log(err.message);
  }
});
