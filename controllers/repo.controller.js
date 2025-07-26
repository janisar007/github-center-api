// const { Octokit } = require("@octokit/rest");

import { Octokit } from "octokit";
import { responseData } from "../utils/response.util.js";
import { getPat } from "../utils/encryption.util.js";
import userModel from "../models/user.model.js";
import repoModel from "../models/repo.model.js";

export const getAlreadySelectedRepos = async (req, res) => {
  const { userId, username } = req.query;

  if (!userId) {
    return responseData(res, 400, "userId is required!", false, []);
  }

  if (!username) {
    return responseData(res, 400, "username is required!", false, []);
  }

  try {
    const find_user = await userModel.findById(userId);

    if (!find_user) {
      return responseData(res, 404, "user not found!", false, []);
    }

    const repos = await repoModel.find({ userId: userId, username: username });

    return responseData(
      res,
      200,
      "Repositories found successfully",
      true,
      repos
    );
  } catch (error) {
    console.log(error);
    return responseData(
      res,
      500,
      "Internal server error getAlreadySelectedRepos",
      false,
      []
    );
  }
};

export const getAllRepoFromGhApi = async (req, res) => {
  const { userId, clerkId, username } = req.query;

  try {
    if (!userId) {
      return responseData(res, 400, "userId is required!", false, []);
    }
    if (!clerkId) {
      return responseData(res, 400, "clerkId is required!", false, []);
    }
    if (!username) {
      return responseData(res, 400, "username is required!", false, []);
    }

    const find_user = await userModel.findById(userId);

    if (!find_user) {
      return responseData(res, 404, "user not found!", false, []);
    }

    const pat = await getPat(userId, username);

    if (!pat) {
      return responseData(res, 404, "Pat not found!", false, []);
    }

    const octokit = new Octokit({ auth: pat });

    // Fetch all repos (paginated)
    const allRepos = await octokit.paginate(
      octokit.rest.repos.listForAuthenticatedUser,
      {
        affiliation: "owner", // only return repos where you're the owner
      }
    );

    const repos = allRepos.map((repo) => ({
      username: repo.owner.name,
      repo_name: repo.name,
      node_id: repo.node_id,
      description: repo.description,
      visibility: repo.visibility,
      repo_id: repo.id,
      repo_updated_at: repo.updated_at,
      repo_url: repo.svn_url,
      is_selected: false,
    }));

    return responseData(
      res,
      200,
      "Repositories found successfully",
      true,
      repos
    );
  } catch (error) {
    console.log(error);
    return responseData(
      res,
      500,
      "Internal server error getAllRepoFromGhApi",
      false,
      []
    );
  }
};

export const postSelectedAndRemoveUnseclectedRepos = async (req, res) => {
  const { userId, clerkId, username, newRepos } = req.body;

  if (!userId) {
    return responseData(res, 400, "userId is required!", false, []);
  }
  if (!clerkId) {
      return responseData(res, 400, "clerkId is required!", false, []);
    }

  if (!username) {
    return responseData(res, 400, "username is required!", false, []);
  }

  if (!Array.isArray(newRepos)) {
    return responseData(res, 400, "newRepos must be an array!", false, []);
  }

  try {
    const find_user = await userModel.findById(userId);

    if (!find_user) {
      return responseData(res, 404, "user not found!", false, []);
    }

    // Step 1: Fetch existing selected repos for the user
    const existingRepos = await repoModel.find({ userId, username });

    // Step 2: Create a Set of new repo_ids from request
    const newRepoIds = new Set(newRepos.map(repo => repo.repo_id));

    // Step 3: Delete repos that are in DB but not in newRepos
    const reposToDelete = existingRepos
      .filter(repo => !newRepoIds.has(repo.repo_id))
      .map(repo => repo._id);

    if (reposToDelete.length > 0) {
      await repoModel.deleteMany({ _id: { $in: reposToDelete } });
    }

    // Step 4: Create a Set of existing repo_ids for fast lookup
    const existingRepoIds = new Set(existingRepos.map(repo => repo.repo_id));

    // Step 5: Add only new repos that are not in DB
    const reposToInsert = newRepos
      .filter(repo => !existingRepoIds.has(repo.repo_id))
      .map(repo => ({
        ...repo,
        userId,
        clerkId: find_user.clerkId,
        username,
        is_selected: true,
      }));

    if (reposToInsert.length > 0) {
      await repoModel.insertMany(reposToInsert);
    }

    return responseData(res, 200, "Repos updated successfully!", true, []);
  } catch (error) {
    console.error(error);
    return responseData(
      res,
      500,
      "Internal server error while updating repos",
      false,
      []
    );
  }
};
