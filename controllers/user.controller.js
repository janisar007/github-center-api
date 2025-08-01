import userModel from "../models/user.model.js";
import { responseData } from "../utils/response.util.js";



export const getUserInfo = async (req, res) => {

    const {clerkId, email} = req.query;

    if(!clerkId) {
        return responseData(res, 400, "clerkId is required!", false, []);
    }

    if(!email) {
        return responseData(res, 400, "email is required!", false, []);
    }

    try {
        const find_user = await userModel.findOne({clerkId, email});
    
        if(!find_user) {
            return responseData(res, 404, "user not found!", false, []);
        }
    
        return responseData(res, 200, "user found successfully", true, find_user);
        
    } catch (error) {
        return responseData(res, 500, "Something went wrong getUserInfo", false, []);
        
    }
}