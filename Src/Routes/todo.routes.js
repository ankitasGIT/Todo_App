import { Router } from "express";
import {createUserTodo} from "../Controllers/todo.controllers.js";
import { verifyJWT } from "../Middlewares/auth.middlewares.js";

const router = Router();

router.route("/create").post(verifyJWT , createUserTodo);

export default router;