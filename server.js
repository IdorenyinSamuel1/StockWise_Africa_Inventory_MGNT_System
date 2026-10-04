import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import transactionRoutes from "./src/routes/transactionRoutes.js";
import salesRoutes from "./src/routes/salesRoutes.js";


dotenv.config();

const app = express();

connectDB();

// Global Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Mount Application Router Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/sales", salesRoutes);

app.get("/", (req, res) => {
  res.json({ message: "StockWise Africa API Engine running successfully" });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Exception Triggered",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`StockWise Africa running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
