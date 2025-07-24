import mongoose from "mongoose";

const repoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  clerkId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  repo_name: {
    type: String,
  },
  accUrl: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("repo", repoSchema);
