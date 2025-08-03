import { Octokit } from "octokit";
import patModel from "../models/pat.model.js";
import { decrypt, encrypt } from "../utils/encryption.util.js";
import { responseData } from "../utils/response.util.js";
import ghModel from "../models/gh.model.js";

export const savePat = async (req, res) => {
  try {
    const { pat, userId, patName, clerkId } = req.body;

    if (!pat) {
      return responseData(res, 400, "PAT is required!", false, []);
    }

    if (!userId) {
      return responseData(res, 400, "userId is required!", false, []);
    }

    if (!clerkId) {
      return responseData(res, 400, "clerkId is required!", false, []);
    }

    if (!patName) {
      return responseData(res, 400, "patName is required!", false, []);
    }

    const octokit = new Octokit({
      auth: pat,
    });

    const { data } = await octokit.rest.users.getAuthenticated();

    const check_github = await ghModel.findOne({username:data.login}); 

    if(check_github) {
        return responseData(res, 400, "Account is already added. you can now only update the PAT.", false, []);
    }

    const githubData = {
        userId: userId,
        clerkId: clerkId,
        username: data.login,
        avatarUrl: data.avatar_url,
        accUrl: data.html_url,
    }

    const savedghData = await ghModel(githubData);
    savedghData.save();

    const encryptedPat = encrypt(pat);

    if (encryptedPat) {
        const savedData = await patModel.create({
          userId: userId,
          clerkId: clerkId,
          pat: encryptedPat,
          patName,
          githubUserName: data.login,
        });

        savedData.save();

      return responseData(res, 200, "Pat saved successfully", true, []);
    }

    return responseData(res, 404, "encryptedPat is empty.", false, []);
  } catch (error) {
    console.log(error);
    responseData(res, 500, "Something went wrong in savePat", false, []);
  }
};

export const updatePat = async (req, res) => {
  try {
    const { pat, userId, patName, ghUsername } = req.body;

    if (!pat) return responseData(res, 400, "PAT is required!", false, []);
    if (!userId) return responseData(res, 400, "userId is required!", false, []);
    if (!ghUsername) return responseData(res, 400, "ghUsername is required!", false, []);
    if (!patName) return responseData(res, 400, "patName is required!", false, []);

    // Validate PAT by calling GitHub API
    let githubUser;
    try {
      const octokit = new Octokit({ auth: pat });
      const { data } = await octokit.rest.users.getAuthenticated();
      githubUser = data;
    } catch (error) {
      return responseData(res, 401, "PAT might be invalid or expired.", false, []);
    }

    const encryptedPat = encrypt(pat);

    const existingPat = await patModel.findOne({ userId, githubUserName: ghUsername, patName:patName });

    if (existingPat) {
      existingPat.pat = encryptedPat;
      await existingPat.save();
      return responseData(res, 200, "PAT updated successfully.", true, []);
    }

    return responseData(res, 404, "PAT not found.", false, []);
  } catch (error) {
    console.error(error);
    return responseData(res, 500, "Something went wrong while updating PAT.", false, []);
  }
};

export const renamePat = async (req, res) => {
  try {
    const { userId, newPatName, ghUsername, patId } = req.body;

    if (!userId) return responseData(res, 400, "userId is required!", false, []);
    if (!ghUsername) return responseData(res, 400, "ghUsername is required!", false, []);
    if (!patId) return responseData(res, 400, "patId is required!", false, []);
    if (!newPatName) return responseData(res, 400, "newPatName is required!", false, []);

    

   
    const existingPat = await patModel.findOne({ userId, githubUserName: ghUsername, _id:patId });

    if (existingPat) {
      existingPat.patName = newPatName;
      await existingPat.save();
      return responseData(res, 200, "PAT renamed successfully.", true, []);
    }

    return responseData(res, 404, "PAT not found.", false, []);
  } catch (error) {
    console.error(error);
    return responseData(res, 500, "Something went wrong while updating PAT.", false, []);
  }
};

export const getPatDetails = async (req, res) => {
  try {
    const { userId, ghUsername } = req.query;

    if (!userId) return responseData(res, 400, "userId is required!", false, []);
    if (!ghUsername) return responseData(res, 400, "ghUsername is required!", false, []);

    const existingPat = await patModel.findOne({
      userId,
      githubUserName: ghUsername,
    }).select("-pat"); 

    if (!existingPat) {
      return responseData(res, 404, "PAT not found.", false, []);
    }

    return responseData(res, 200, "PAT found successfully.", true, existingPat);
  } catch (error) {
    console.error(error);
    return responseData(res, 500, "Something went wrong while fetching PAT.", false, []);
  }
};