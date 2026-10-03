import User from "../models/userModel.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

//  Register a new StockWise Africa user profile with Cloudinary upload
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide an email and password" });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Return user profile data along with a fresh access token
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        token: generateToken(user._id, user.role)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server login execution error",
      error: error.message
    });
  }
};
// Register a new StockWise Africa user profile with Cloudinary upload
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate mandatory user fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill out all required fields" });
    }

    // Check if account already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User account already exists with this email" });
    }

    // Handle optional profile picture streaming to Cloudinary
    let profilePictureUrl;
    if (req.file) {
      const cloudResult = await uploadToCloudinary(req.file.buffer, "profiles", "image");
      profilePictureUrl = cloudResult.secure_url; // Grabs the clean cloud string url
    }

    // Securely encrypt user password hash before database storage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Commit record to MongoDB Atlas 
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Staff", 
      ...(profilePictureUrl && { profilePicture: profilePictureUrl }) 
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          token: generateToken(user._id, user.role)
        }
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data profile" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server registration execution error",
      error: error.message
    });
  }
};
