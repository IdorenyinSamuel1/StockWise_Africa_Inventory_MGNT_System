import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    sku: {
      type: String,
      required: [true, "Product SKU is required"],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be a negative value"]
    },
    quantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      default: 0,
      min: [0, "Quantity cannot be less than zero"]
    },
    reorderLevel: {
      type: Number,
      required: [true, "Low-stock reorder limit threshold is required"],
      default: 10 
    },
    // Cloudinary Media Fields
     // Array structure allowing multiple product photo URLs
    images: {
      type: [String],
      default: []
    },
    // String structure holding a single product video clip URL
    videoUrl: {
      type: String, 
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
