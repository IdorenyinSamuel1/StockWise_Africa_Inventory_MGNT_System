import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; 

//  Verify token legitimacy
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user profile from database and attach it to the global request object
      req.user = await User.findById(decoded.id);

      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Not authorized, token validation failed" });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: "Not authorized, no token signature found" });
  }
};

//  Restrict endpoint access based on assigned RBAC Roles
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: `Forbidden Access: Your role (${req.user?.role || "Guest"}) does not have permissions to perform this action.`
      });
    }
  };
};
