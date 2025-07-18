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

// export const savePat = async (req, res) => {
//   try {
//     const { pat, userId } = req.body;

//     if (!pat) {
//       return responseData(res, 400, "PAT is required!", false, []);
//     }

//     if (!userId) {
//       return responseData(res, 400, "userId is required!", false, []);
//     }

//     const encryptedPat = encrypt(pat);

//     if (encryptedPat) {
//       const savedData = await patModel.create({
//         userId: userId,
//         pat: encryptedPat,
//       });

//       savedData.save();

//       return responseData(res, 200, "Pat saved successfully", true, []);
//     }

//     return responseData(res, 404, "encryptedPat is empty.", false, []);
//   } catch (error) {

//     console.log(error)
//     responseData(res, 500, "Something went wrong in savePat", false, []);
//   }
// };
