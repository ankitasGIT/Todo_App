import { Todo } from "../Models/todo.models.js";
import { User } from "../Models/user.models.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/apiResponse.js";
import {asyncHandler} from "../Utils/asyncHandler.js";


const createUserTodo = asyncHandler( async(req, res, next) => {
    const {userId, title, description} = req.body;

    if(!title)
    {
        throw new ApiError(401, "Invalid todo");
    }

    const todo = await Todo.create({
        userId: userId,
        title : title,
        description: description
    });

    return res.status(201)
    .json(
        new ApiResponse(201, todo, "Todo created successfully")
    )
} )

export {createUserTodo};