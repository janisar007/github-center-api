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
  },
  repo_name: {
    type: String,
  },
  node_id: {
    type: String,
  },
  description: {
    type: String,
  },
  visibility: {
    type: String,
  },
  repo_id: {
    type: Number,
  },
  repo_updated_at: {
    type: String,
  },
  repo_updated_at: {
    type: String,
  },
  is_selected: {
    type: Boolean,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("repo", repoSchema);
