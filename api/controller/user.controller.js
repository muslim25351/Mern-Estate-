import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../util/error.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.json({ message: "hello world!" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only update your own account"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only delete your own account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("user has been deleted");
  } catch (err) {
    next(err);
  }
};
export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({
        userRef: req.params.id,
      });
      if (!listings) {
        return res
          .status(404)
          .json({ success: false, message: "No listings found" });
      }
      res.status(200).json(listings);
      //console.log(listings);
    } catch (err) {
      next(err);
    }
  } else {
    return next(errorHandler(401, "you can only get your own listings"));
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "user not found"));
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};
