import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_ATLAS);
    console.log(`StockWise Africa DB Active: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database initialization failure: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
