import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a full name"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Please add an email address"],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false 
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Staff"],
      default: "Staff" 
    },
    profilePicture: {
      type: String,
      default: "https://cloudinary.com" 
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true 
  }
);

const User = mongoose.model("User", userSchema);
export default User;
