import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({

   username:
   {
            type: String,
            required: true, 
            unique: true, 
            lowercase: true,
            trim: true,
            index: true
        },
    email:
    {
            type: String,
            required: true, 
            unique: true, 
            lowercase: true,
            trim: true,
        },
    password:
    {
            type: String,
            unique: true,
            required: [true, 'Password is reuired']
    },
    refreshToken : {
        type: String
    },

})


userSchema.pre("save", async function(next){
    if(!this.isModified("password"))
        return next();

    this.password = await bcrypt.hash(this.password, 10);
    return next();
})


userSchema.methods.isPasswordCorrect = async function(PassWord){
    return await bcrypt.compare(PassWord, this.password);
}

userSchema.methods.generateAccessTokens = function () {
    return jwt.sign({
        //payload/data : coming  from db
        _id: this.id,
        email: this.email,
        username: this.userName,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}

userSchema.methods.generateRefreshTokens = function () {
    return jwt.sign({
        //payload/data : coming  from db
        _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const User = mongoose.model("User", userSchema);


