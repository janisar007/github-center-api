import { responseData } from "../utils/response.util.js";
import ghModel from "../models/gh.model.js";
import userModel from "../models/user.model.js";
import groupModel from "../models/group.model.js";

export const createGroupandAddRepo = async (req, res) => {
  try {
    const { userId, groupName, ghUsername, clerkId, repoIds } = req.body;

    if (!userId) {
      return responseData(res, 400, "userId is required!", false, []);
    }

    if (!clerkId) {
      return responseData(res, 400, "clerkId is required!", false, []);
    }

    if (!groupName) {
      return responseData(res, 400, "groupName is required!", false, []);
    }

    if (!ghUsername) {
      return responseData(res, 400, "ghUsername is required!", false, []);
    }

    if (!repoIds || repoIds.length === 0) {
      return responseData(res, 400, "Include at least one repository!", false, []);
    }

    const find_user = await userModel.findById(userId);
    if (!find_user) {
      return responseData(res, 404, "User not found!", false, []);
    }

    const find_gh = await ghModel.findOne({ userId: userId, username: ghUsername });
    if (!find_gh) {
      return responseData(res, 404, "GitHub account not found!", false, []);
    }

    let group = await groupModel.findOne({ userId, ghUsername, groupName });

    if (!group) {
      // Create a new group
      group = await groupModel.create({
        userId,
        clerkId,
        ghUsername,
        groupName,
        repoIds,
      });
    } else {
      // Update the group's repoIds if needed (optional)
      const updatedRepoIds = [...new Set([...group.repoIds, ...repoIds])];
      group.repoIds = updatedRepoIds;
      await group.save();
    }

    // Update all repos to assign the group_id
    await repoModel.updateMany(
      { repo_id: { $in: repoIds }, userId: userId },
      { $set: { group_id: group._id } }
    );

    return responseData(res, 200, "Group assignment completed.", true, []);

  } catch (error) {
    console.error("createGroupandAddRepo error:", error);
    return responseData(res, 500, "Something went wrong in createGroupandAddRepo", false, []);
  }
};


export const updateGroup = async (req, res) => {
  try {
    const { groupId, newGroupName, userId, ghUsername } = req.body;

    if (!groupId) {
      return responseData(res, 400, "groupId is required!", false, []);
    }

    if (!newGroupName) {
      return responseData(res, 400, "newGroupName is required!", false, []);
    }

    if (!userId) {
      return responseData(res, 400, "userId is required!", false, []);
    }

    if (!ghUsername) {
      return responseData(res, 400, "ghUsername is required!", false, []);
    }

    // Check if another group with the new name already exists for same user + GitHub username
    const nameExists = await groupModel.findOne({
      userId,
      ghUsername,
      groupName: newGroupName,
      _id: { $ne: groupId },
    });

    if (nameExists) {
      return responseData(res, 409, "Group name already in use!", false, []);
    }

    const updatedGroup = await groupModel.findByIdAndUpdate(
      groupId,
      { groupName: newGroupName },
      { new: true }
    );

    if (!updatedGroup) {
      return responseData(res, 404, "Group not found!", false, []);
    }

    return responseData(res, 200, "Group name updated successfully.", true, []);

  } catch (error) {
    console.error("updateGroup error:", error);
    return responseData(res, 500, "Something went wrong in updateGroup.", false, []);
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId, userId, ghUsername } = req.body;

    if (!groupId) {
      return responseData(res, 400, "groupId is required!", false, []);
    }

    if (!userId) {
      return responseData(res, 400, "userId is required!", false, []);
    }

    if (!ghUsername) {
      return responseData(res, 400, "ghUsername is required!", false, []);
    }

    const group = await groupModel.findOne({ _id: groupId, userId, ghUsername });

    if (!group) {
      return responseData(res, 404, "Group not found!", false, []);
    }

    // Delete the group
    await groupModel.deleteOne({ _id: groupId });

    // Remove group_id from associated repos
    await repoModel.updateMany(
      { group_id: groupId },
      { $unset: { group_id: "" } }
    );

    return responseData(res, 200, "Group deleted successfully.", true, []);
  } catch (error) {
    console.error("deleteGroup error:", error);
    return responseData(res, 500, "Something went wrong in deleteGroup.", false, []);
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const { userId, ghUsername } = req.query; // assuming GET with query params

    if (!userId) {
      return responseData(res, 400, "userId is required!", false, []);
    }

    if (!ghUsername) {
      return responseData(res, 400, "ghUsername is required!", false, []);
    }

    const groups = await groupModel.find({ userId, ghUsername }).sort({ createdAt: -1 });

    return responseData(res, 200, "Groups fetched successfully.", true, groups);
  } catch (error) {
    console.error("getGroupsByGithubUsername error:", error);
    return responseData(res, 500, "Something went wrong getAllGroups.", false, []);
  }
};
