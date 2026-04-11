import { Router } from "express";
import { validateRegisterUser } from "../validators/auth.validator.js";
import { registerController } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", validateRegisterUser, registerController);

export default authRouter;
