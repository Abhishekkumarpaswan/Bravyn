const mongoose = require("mongoose");

// Database Setup
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
    return connectionInstance;
  } catch (error) {
    console.log("MONGODB connection FAILED", error);
    process.exit(1);
  }
};

module.exports = connectDB;
