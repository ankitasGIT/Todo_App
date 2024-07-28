import { Router } from "express";
import {loginUser, logOutUser, registerUser} from "../Controllers/user.controllers.js";
import { verifyJWT } from "../Middlewares/auth.middlewares.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/logout").post( verifyJWT ,logOutUser);

export default router;

