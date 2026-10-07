import express from "express";

import {
  createSupplier,
  getSuppliers,
  getSupplierById
} from "../controllers/supplierController.js";

import {
  protect,
  authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

// All supplier routes require login
router.use(protect);

// Create supplier - Admin and Manager only
router.post(
  "/",
  authorize("Admin", "Manager"),
  createSupplier
);

// Get all suppliers - Admin, Manager and Staff
router.get(
  "/",
  authorize("Admin", "Manager", "Staff"),
  getSuppliers
);

// Get one supplier - Admin, Manager and Staff
router.get(
  "/:id",
  authorize("Admin", "Manager", "Staff"),
  getSupplierById
);

export default router;