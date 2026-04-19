import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    { expiresIn: "3d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message,
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      contact: user.contact,
      role: user.role,
    },
  });
}

export const registerController = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    //Check user already exists or not
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or contact already exits",
        success: false,
      });
    }

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenResponse(user, res, "User registered successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  const passwordMatch = await user.comparePassword(password);

  if (!passwordMatch) {
    return res
      .status(400)
      .json({ message: "Invalid email or password", success: false });
  }

  await sendTokenResponse(user, res, `Welcome back, ${user.fullname}!`);
};

export const getMeController = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    message: "User fetched successfully",
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
};

export const googleCallback = async (req, res) => {
  const { id, displayName, emails, photos } = req.user;
  const email = emails[0].value;
  const profilePic = photos[0].value;

  let user = await userModel.findOne({ email });

  if (!user) {
    user = await userModel.create({
      email,
      googleId: id,
      fullname: displayName,
    });
  }

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token);

  res.redirect("http://localhost:5173/");
};
