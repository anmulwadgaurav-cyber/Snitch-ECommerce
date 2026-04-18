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
import { config } from "../config/config.js";

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
  passport.authenticate("google", {
    session: false,
    failureRedirect:
      config.NODE_ENV === "development"
        ? "http://localhost:5173/login"
        : "/login",
  }),
  googleCallback,
);

export default authRouter;
