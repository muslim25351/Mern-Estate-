import express from "express";
import { test, updateUser } from "../controller/user.controller.js";
import { verifyToken } from "../util/verifyUser.js";
const route = express.Router();
route.get("/test", test);
route.post("/update/:id", verifyToken, updateUser);
export default route;
