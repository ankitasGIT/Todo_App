
import mongoose from "mongoose";
import { dbname } from "../constants.js";

const connectDb = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI_NAME}/${dbname}`);

        // console.log(`MongoDB connected !! MONGODB HOST : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('MongoDB Connection error : '  ,error);
    }
}

export default connectDb;