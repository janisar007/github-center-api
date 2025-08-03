import mongoose from "mongoose";
import ghModel from "../models/gh.model.js";
import groupModel from "../models/group.model.js";
import patModel from "../models/pat.model.js";
import repoModel from "../models/repo.model.js";
import userModel from "../models/user.model.js";
import { responseData } from "../utils/response.util.js";

export const getAllGh = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return responseData(res, 400, "userId is required!", false, []);
    }

    const find_user = userModel.findById(userId);

    if (!find_user) {
      return responseData(res, 404, "user not found!", false, []);
    }

    const find_allgh = await ghModel.find({ userId: userId });

    if (!find_allgh) {
      return responseData(res, 404, "gh not found!", false, []);
    }

    return responseData(
      res,
      200,
      "All gh found Successfully",
      true,
      find_allgh
    );
  } catch (error) {
    console.log(error);
    responseData(res, 500, "Something went wrong in savePat", false, []);
  }
};

export const getGithubAccountDetails = async (req, res) => {
  try {
    const { userId, ghUsername } = req.query;

    // Validate input
    if (!userId)
      return responseData(res, 400, "userId is required!", false, []);
    if (!ghUsername)
      return responseData(res, 400, "ghUsername is required!", false, []);

    // Search for GitHub account
    const account = await ghModel.findOne({
      userId,
      username: ghUsername,
    });

    if (!account) {
      return responseData(res, 404, "GitHub account not found.", false, []);
    }

    return responseData(
      res,
      200,
      "GitHub account fetched successfully.",
      true,
      account
    );
  } catch (error) {
    console.error("Error fetching GitHub account:", error);
    return responseData(
      res,
      500,
      "Something went wrong while fetching GitHub account.",
      false,
      []
    );
  }
};

export const removeGithubAccount = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { userId, ghUsername } = req.query;

    if (!userId)
      return responseData(res, 400, "userId is required!", false, []);
    if (!ghUsername)
      return responseData(res, 400, "ghUsername is required!", false, []);

    const find_user = userModel.findById(userId);

    if (!find_user) {
      return responseData(res, 404, "user not found!", false, []);
    }

    // Start transaction
    session.startTransaction();

    // 1. Delete from ghModel
    const ghResult = await ghModel.deleteMany(
      { userId, username: ghUsername },
      { session }
    );

    // 2. Delete from groupModel
    const groupResult = await groupModel.deleteMany(
      { userId, ghUsername: ghUsername },
      { session }
    );

    // 3. Delete from patModel
    const patResult = await patModel.deleteMany(
      { userId, githubUserName: ghUsername },
      { session }
    );

    // 4. Delete from repoModel
    const repoResult = await repoModel.deleteMany(
      { userId, username: ghUsername },
      { session }
    );

    // Commit only if all operations succeed
    await session.commitTransaction();
    session.endSession();

    return responseData(
      res,
      200,
      "All GitHub-related records deleted successfully.",
      true,
      []
    );
  } catch (error) {
    // Rollback all changes if any operation failed
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed:", error);
    return responseData(
      res,
      500,
      "Failed to delete GitHub-related data. Rolled back all changes.",
      false,
      []
    );
  }
};

export const resetGithubAccount = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { userId, ghUsername } = req.query;

    if (!userId)
      return responseData(res, 400, "userId is required!", false, []);
    if (!ghUsername)
      return responseData(res, 400, "ghUsername is required!", false, []);

    const find_user = userModel.findById(userId);

    if (!find_user) {
      return responseData(res, 404, "user not found!", false, []);
    }

    // Start transaction
    session.startTransaction();

    // 2. Delete from groupModel
    const groupResult = await groupModel.deleteMany(
      { userId, ghUsername: ghUsername },
      { session }
    );

    // 4. Delete from repoModel
    const repoResult = await repoModel.deleteMany(
      { userId, username: ghUsername },
      { session }
    );

    // Commit only if all operations succeed
    await session.commitTransaction();
    session.endSession();

    return responseData(
      res,
      200,
      "Github account reset successfully.",
      true,
      []
    );
  } catch (error) {
    // Rollback all changes if any operation failed
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed:", error);
    return responseData(
      res,
      500,
      "Failed to reset GitHub-related data. Rolled back all changes.",
      false,
      []
    );
  }
};
