import {app} from "./app.js";
import dotenv from "dotenv";
import connectDb from "./Db/dbconnect.js";

dotenv.config({
    path: './env'
})


connectDb()
.then( () => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on ${process.env.PORT}`);
        })
    })
.catch( (error) => {
    console.log("MONGODB connection went wrong!!", error)
} )

