import { ApiError } from "../Utils/apiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.models.js";

export const verifyJWT = asyncHandler(async(req, _ , next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        //no token
        if(!token)
        {
            throw new ApiError(401, "Unauthorized request")
        }
    
        //verify that token -> provide -> token & 
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        //find user from db
        const checkUser = await User.findById(decodeToken?._id).select("-password -refreshToken");
    
        if(!checkUser)
        {
            throw new ApiError(401, "Invalid access token");
        }
    
        //user is present ->  dont return -> we have req!!
        //add new object
        req.user = checkUser;
    
        next() // middleware this is
    } catch (error) {
        throw new ApiError(401, error?.message || "Invlid access token")
    }
})