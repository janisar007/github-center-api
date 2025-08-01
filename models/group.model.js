import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  clerkId: {
    type: String,
    required: true,
  },
  ghUsername: {
    type: String,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  repoIds: [],

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Group", groupSchema);
