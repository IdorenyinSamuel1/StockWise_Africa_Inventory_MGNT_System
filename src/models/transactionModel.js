import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Transaction must be linked to a product"]
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: [true, "Transaction must be linked to a supplier"]
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Transaction must record the handling staff member"]
    },
    quantityAdded: {
      type: Number,
      required: [true, "Quantity added amount is required"],
      min: [1, "Stock intake must be at least 1 item unit"]
    },
    notes: {
      type: String,
      trim: true,
      default: "Standard warehouse stock restock replenishment"
    }
  },
  {
    timestamps: true 
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
