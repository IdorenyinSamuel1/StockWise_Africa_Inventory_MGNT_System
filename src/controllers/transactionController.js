import Transaction from "../models/transactionModel.js";
import Product from "../models/productModel.js";


//   Only Admin, Manager
export const stockInProduct = async (req, res) => {
  try {
    const { productId, supplierId, quantityAdded, notes } = req.body;

    //  Check if the product exists in our warehouse database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // We add the incoming quantity to the old quantity
    product.quantity += Number(quantityAdded);
    await product.save(); 

    // Write the paper receipt in the ledger collection
    const transaction = await Transaction.create({
      product: productId,
      supplier: supplierId,
      user: req.user._id, // Grabs the ID of the logged-in staff from auth middleware
      quantityAdded,
      notes
    });

    res.status(201).json({
      success: true,
      message: `Stock replenished successfully. Added ${quantityAdded} units to ${product.name}.`,
      data: transaction
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process stock intake transaction",
      error: error.message
    });
  }
};
