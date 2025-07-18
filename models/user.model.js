import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: String,
  name: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
