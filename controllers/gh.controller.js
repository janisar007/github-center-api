import ghModel from "../models/gh.model.js";
import userModel from "../models/user.model.js";
import { responseData } from "../utils/response.util.js";

export const getAllGh = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return responseData(res, 400, "userId is required!", false, []);
    }

    const find_user = userModel.findById(userId);

    if(!find_user) {
        return responseData(res, 404, "user not found!", false, []);
    }


    const find_allgh = await ghModel.find({userId: userId});

    if(!find_allgh) {
        return responseData(res, 404, "gh not found!", false, []);
    }

    return responseData(res, 200, "All gh found Successfully", true, find_allgh);

  } catch (error) {
    console.log(error);
    responseData(res, 500, "Something went wrong in savePat", false, []);
  }
};
