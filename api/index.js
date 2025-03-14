import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./route/user.route.js";
import authRoute from "./route/auth.route.js";
dotenv.config();
mongoose
  .connect(process.env.Mongo)
  .then(() => {
    console.log("Connected to MongoDB!!!");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000!!!");
});
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
//middleware for error hadndling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
