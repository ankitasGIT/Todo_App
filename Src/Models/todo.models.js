import mongoose, {Schema} from "mongoose";

const todoSchema = new Schema({
    userId: {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    title:
    {
            type: String,
            required: true, 
        },
    description:
    {
            type: String,
            required: true
    },
    

})


export const Todo = mongoose.model("Todo", todoSchema);

