import mongoose from "mongoose";

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected: " + conn.connection.host);
  } catch (error) {
    console.log("MongoDB connection failed: " + error.message);
    process.exit(1);
  }
}

export default connectDB;
