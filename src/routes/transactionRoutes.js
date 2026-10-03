import express from "express";
import { stockInProduct } from "../controllers/transactionController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth locks
router.use(protect);

// Route: POST /api/transactions/stock-in
router.post("/stock-in", authorize("Admin", "Manager"), stockInProduct);

export default router;
