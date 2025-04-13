import { errorHandler } from "../util/error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return errorHandler(401, "unauthorized access");
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return errorHandler(403, "forbidden");
    req.user = user;
    next();
  });
};
