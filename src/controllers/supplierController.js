import Supplier from "../models/supplierModel.js";

//   POST /api/suppliers
//   Private - Admin, Manager
export const createSupplier = async (req, res) => {
  try {
    const {
      name,
      contactPerson,
      email,
      phone,
      address
    } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Supplier name and phone number are required"
      });
    }

    // Check if supplier with the same phone already exists
    const supplierExists = await Supplier.findOne({ phone });

    if (supplierExists) {
      return res.status(400).json({
        success: false,
        message: "A supplier with this phone number already exists"
      });
    }

    // Create supplier
    const supplier = await Supplier.create({
      name,
      contactPerson,
      email,
      phone,
      address
    });

    res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: supplier
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create supplier",
      error: error.message
    });
  }
};


//   GET /api/suppliers
//   Private - Admin, Manager, Staff
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve suppliers",
      error: error.message
    });
  }
};


//   GET /api/suppliers/:id
//   Private - Admin, Manager, Staff
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    res.status(200).json({
      success: true,
      data: supplier
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve supplier",
      error: error.message
    });
  }
};