import Product from "../models/productModel.js";
import { uploadToCloudinary } from "../config/cloudinary.js"; 
import mongoose from "mongoose";

//   POST /api/products
// OnlyAdmin, Manager
export const createProduct = async (req, res) => {
  try {
    const { name, sku, description, price, quantity, reorderLevel } = req.body;

    // Mandatory input validation
    if (!name || !sku || !price || !quantity) {
      return res.status(400).json({ success: false, message: "Please provide all required product fields" });
    }

    // Prevent SKU duplication
    const productExists = await Product.findOne({ sku });
    if (productExists) {
      return res.status(400).json({ success: false, message: "A product with this SKU already exists" });
    }

    // Process Multiple Image Uploads to Cloudinary
    let imageUrls = [];
    if (req.files && req.files.productImages) {
      const imageFiles = req.files.productImages;
      for (const file of imageFiles) {
        const cloudResult = await uploadToCloudinary(file.buffer, "products/images", "image");
        imageUrls.push(cloudResult.secure_url);
      }
    }

    // Process Single Video Upload to Cloudinary
    let videoUrl = "";
    if (req.files && req.files.productVideo) {
      const videoFile = req.files.productVideo[0]; // Capture the single video file block
      const cloudResult = await uploadToCloudinary(videoFile.buffer, "products/videos", "video");
      videoUrl = cloudResult.secure_url;
    }

    // Save Product Record to MongoDB
    const product = await Product.create({
      name,
      sku,
      description,
      price,
      quantity,
      reorderLevel: reorderLevel || 10,
      images: imageUrls,
      videoUrl: videoUrl
    });

    res.status(201).json({
      success: true,
      message: "Product added to inventory successfully",
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product record",
      error: error.message
    });
  }
};

//   GET /api/products
// OnlyAdmin, Manager, Staff
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    const processedProducts = products.map(product => {
      const productObj = product.toObject();
      productObj.isLowStock = product.quantity <= product.reorderLevel;
      return productObj;
    });

    res.status(200).json({ success: true, count: processedProducts.length, data: processedProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server product retrieval error", error: error.message });
  }
};

//   GET /api/products/:id
// OnlyAdmin, Manager, Staff
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product identifier format" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product record not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error retrieving product details", error: error.message });
  }
};


//   PATCH /api/products/:id
//Only Admin, Manager
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product identifier format" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product record not found" });
    }

    // Handle field revisions dynamically from body fields
    const fieldsToUpdate = ["name", "description", "price", "quantity", "reorderLevel"];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: "Inventory item updated successfully",
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update product details", error: error.message });
  }
};

//   DELETE /api/products/:id
//   Only Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product identifier format" });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product record not found" });
    }

    res.status(200).json({ success: true, message: "Product dropped from inventory database successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server product removal error", error: error.message });
  }
};

// GET /api/products/alerts/low-stock
//  Only Admin, Manager, Staff
export const getLowStockAlerts = async (req, res) => {
  try {
    // Queries MongoDB: Filter products where quantity is less than or equal to reorderLevel
    const lowStockProducts = await Product.find({
      quantity: { $lte: "$reorderLevel" }
    });

    res.status(200).json({
      success: true,
      count: lowStockProducts.length,
      message: lowStockProducts.length === 0 
        ? "All products are well stocked!" 
        : `Found ${lowStockProducts.length} items requiring urgent replenishment.`,
      data: lowStockProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve low stock alerts",
      error: error.message
    });
  }
};
