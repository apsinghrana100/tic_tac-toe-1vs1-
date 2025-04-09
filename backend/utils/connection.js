
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const MONGO_URI = process.env.MONGODB_ATLAS_URI

// Mongoose connection options (optimized for production)
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s if no response
  socketTimeoutMS: 45000, // Close inactive sockets after 45s
  autoIndex: false, // Disable auto-creation of indexes in production
  maxPoolSize: 10, // Maintain up to 10 socket connections
};

// 🔹 Async function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, options);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    throw err; // Throw error to stop server startup
  }
};

// 🔹 Gracefully Close MongoDB Connection on App Exit
process.on("SIGINT", async () => {
  console.log("🚪 Closing MongoDB connection...");
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB;


// import { MongoClient, ServerApiVersion } from 'mongodb';


// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// export const client = new MongoClient(process.env.MONGODB_ATLAS_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
