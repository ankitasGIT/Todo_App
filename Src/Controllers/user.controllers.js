import {asyncHandler} from "../Utils/asyncHandler.js";
import {ApiResponse} from "../Utils/apiResponse.js";
import {ApiError} from "../Utils/apiError.js";
import {User} from "../Models/user.models.js";
import bcrypt from "bcrypt";

const registerUser = asyncHandler( async(req, res) => {
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
            password: password,
        }
    );


    const createdUser = await User.findById(user._id);

    if(!createdUser)
    {
        throw new ApiError(500, "Something went wrong while registration");
    }

    

    return res.status(200).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
    
} )

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        
        const foundUser = await User.findById(userId);
        const accessToken = foundUser.generateAccessTokens();
        const refreshToken = foundUser.generateRefreshTokens();

        foundUser.refreshToken = refreshToken;
        await foundUser.save({validateBeforeSave : false});

        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(401, "Something went wrong");
    }
}

const loginUser = asyncHandler( async(req, res) => {
    const {email, password} = req.body;

    console.log(email);
    console.log(password);


    if(!email || !password)
    {
        throw new ApiError(400, "Password or email required");
    }

    const findUser = await User.findOne({
        $or: [{email}]
    })

    if(!findUser)
    {
        throw new ApiError(404, "User does not exist");
    }


    const isValidPassword = await bcrypt.compare(password, findUser.password);

    if(!isValidPassword)
    {
        throw new ApiError(404, "Invalid Password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(findUser._id);

    console.log(accessToken);
    console.log(refreshToken);

    const loggedInUser = await User.findById(findUser._id).select(
        "-password -refreshToken" 
    )
    
    const options = {
        httpOnly: true,
        secure : true
    }


    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken
        },
        "User logged in successfully"
    )
    )
} )

const logOutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )

} )


export {
    registerUser,
    loginUser,
    logOutUser,

}


