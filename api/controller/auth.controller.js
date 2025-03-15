import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedpassword = bcryptjs.hashSync(password, 10);
  const newUser = User({ username, email, password: hashedpassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "user created successfully" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
