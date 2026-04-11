import { Router } from "express";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../validators/auth.validator.js";
import {
  googleCallback,
  loginController,
  registerController,
} from "../controllers/auth.controller.js";
import passport from "passport";

const authRouter = Router();

authRouter.post("/register", validateRegisterUser, registerController);
authRouter.post("/login", validateLoginUser, loginController);

//GOOGLE AUTH
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback,
);

export default authRouter;
