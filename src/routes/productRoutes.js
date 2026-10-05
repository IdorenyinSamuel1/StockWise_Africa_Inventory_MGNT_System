import express from "express";
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct,
  getLowStockAlerts 
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Define multi-field rules: up to 5 product photos, and 1 product demo video clip
const productMediaFields = upload.fields([
  { name: "productImages", maxCount: 5 },
  { name: "productVideo", maxCount: 1 }
]);

// Apply global protect middleware so all routes below require authentication tokens
router.use(protect);

router.route("/")
  .post(authorize("Admin", "Manager"), productMediaFields, createProduct)
  .get(authorize("Admin", "Manager", "Staff"), getAllProducts);

router.get("/alerts/low-stock", authorize("Admin", "Manager", "Staff"), getLowStockAlerts);

router.route("/:id")
  .get(authorize("Admin", "Manager", "Staff"), getProductById)
  .patch(authorize("Admin", "Manager"), updateProduct)
  .delete(authorize("Admin"), deleteProduct);

export default router;
