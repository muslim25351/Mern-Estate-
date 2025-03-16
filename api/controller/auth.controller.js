import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../util/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedpassword = bcryptjs.hashSync(password, 10);
  const newUser = User({ username, email, password: hashedpassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "user created successfully" });
  } catch (err) {
    next(err);
  }
};
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      return next(errorHandler(404, "user not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Wrong creidential!"));
    }
    const { password: pass, ...rest } = validUser._doc;
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    res.cookie("access_token", token, { httpOnly: true });
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};
