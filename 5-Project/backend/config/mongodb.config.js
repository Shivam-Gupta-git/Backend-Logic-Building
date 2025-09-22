import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      process.env.MONGODB_URL ||
      "mongodb://localhost:27017/Project";
    const connectionDB = await mongoose.connect(mongoURI);
    console.log(
      `database connection successfully : ${connectionDB.connection.host}`
    );
  } catch (error) {
    console.log("database connection failed", error);
    process.exit(1);
  }
};
export default connectDB;
