import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "A sale must be linked to a valid product record"]
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A sale must record the handling staff member"]
    },
    quantitySold: {
      type: Number,
      required: [true, "Quantity sold unit amount is required"],
      min: [1, "A sale transaction must consist of at least 1 unit item"]
    },
    totalPrice: {
      type: Number,
      required: [true, "Total transaction price summary is required"],
      min: [0, "Total price summary cannot be a negative dollar numeric amount"]
    },
    notes: {
      type: String,
      trim: true,
      default: "Standard outbound inventory marketplace retail sales distribution"
    }
  },
  {
    timestamps: true 
  }
);

const Sales = mongoose.model("Sales", salesSchema);
export default Sales;
