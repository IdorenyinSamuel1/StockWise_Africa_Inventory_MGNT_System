import express from "express";
import { createSale, getSalesHistory } from "../controllers/salesController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply token authorization protection globally across this domain path
router.use(protect);

router.route("/")
// Any worker can ring up an outbound sale
  .post(authorize("Admin", "Manager", "Staff"), createSale) 
  // Only supervisors can audit financial logs
  .get(authorize("Admin", "Manager"), getSalesHistory);     

export default router;
