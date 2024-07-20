import {asyncHandler} from "../Utils/asynHandler.js";
import {ApiResponse} from "../Utils/apiResponse.js";
import {ApiError} from "../Utils/apiError.js";
import {User} from "../Models/user.models.js";


const registerUser = asyncHandler( async() => {
    const {username, email, password} = req.body;

    if(!username || !email || !password)
    {
        throw new ApiError(400, "All details are required");
    }

    const existingUser = await User.findOne({
        $or: [{email}, {username}]
    });

    if(existingUser)
    {
        throw new ApiError(409, "User already exists")
    }

    const user = await User.create(
        {
            username : username,
            email : email,
            password: password
        }
    );
    
} )
