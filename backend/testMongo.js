// testMongoConnection.js
import mongoose from "mongoose";

const uri = "mongodb+srv://vanshpanwar0018_db_user:tueiZIHQA8D4qjFw@chatapp.sba3jib.mongodb.net/chatapp?retryWrites=true&w=majority";

(async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully!");
    await mongoose.disconnect();
    console.log("🔌 Connection closed. Everything works fine!");
  } catch (err) {
    console.error("❌ MongoDB connection error:");
    console.error(err.message);
  }
})();
