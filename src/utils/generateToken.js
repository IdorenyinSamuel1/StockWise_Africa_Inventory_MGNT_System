import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  // Added a secret text string directly here so it never crashes again!
  const secretKey = process.env.JWT_SECRET || "StockWise_Africa_Secret_Key_2026_Unbreakable";
  
  return jwt.sign(
    { id, role }, 
    secretKey, 
    { expiresIn: "30d" }
  );
};

export default generateToken;

