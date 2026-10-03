import Sales from "../models/salesModel.js";
import Product from "../models/productModel.js";

// only Admin, Manager, Staff...  Process a Stock-Out sale transaction
export const createSale = async (req, res) => {
  try {
    const { productId, quantitySold, notes } = req.body;

    // Inputs validation check
    if (!productId || !quantitySold) {
      return res.status(400).json({ success: false, message: "Please provide a valid product identifier and quantity sold" });
    }

    // Fetch product records from inventory database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Inventory product record not found" });
    }

    // Verify stock level availability before making a sale
    if (product.quantity < Number(quantitySold)) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock inventory! Only ${product.quantity} units of ${product.name} are available, requested ${quantitySold}.`
      });
    }

    // Calculate total revenue price for the sale transaction
    const totalTransactionPrice = product.price * Number(quantitySold);

    // Deduct shelf count DOWN and commit changes
    product.quantity -= Number(quantitySold);
    await product.save();

    // Log the historic operational outbound ledger event sequence
    const sale = await Sales.create({
      product: productId,
      user: req.user._id,
      quantitySold: Number(quantitySold),
      totalPrice: totalTransactionPrice,
      notes
    });

    // Check if new quantity drops below the reorder level to fire warnings
    let systemAlert = null;
    if (product.quantity <= product.reorderLevel) {
      systemAlert = `LOW-STOCK WARNING ALERT: ${product.name} stock level drops down to ${product.quantity} units. Please restock immediately!`;
    }

    // Dispatch finished response with sale transaction details and any low-stock alert
    res.status(201).json({
      success: true,
      message: "Sales transaction processed successfully",
      alert: systemAlert,
      data: sale
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server sales processing execution crash",
      error: error.message
    });
  }
};

//  Only Admin, Manager, Staff can access this endpoint
export const getSalesHistory = async (req, res) => {
  try {
    const history = await Sales.find({})
      .populate("product", "name sku price")
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server database history retrieval failed", error: error.message });
  }
};
