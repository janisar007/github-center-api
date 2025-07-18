import mongoose from "mongoose";

const patSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  clerkId: {
    type: String,
    required: true,
  },
  pat: {
    type: String,
    required: true,
    unique: true,
  },
  githubUserName: {
    type: String,
    required: true,
  },
  patName: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Pat", patSchema);
