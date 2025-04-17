import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUserListings,
} from "../controller/user.controller.js";
import { verifyToken } from "../util/verifyUser.js";
const route = express.Router();
route.get("/test", test);
route.post("/update/:id", verifyToken, updateUser);
route.delete("/delete/:id", verifyToken, deleteUser);
route.get("/listings/:id", verifyToken, getUserListings);
export default route;
