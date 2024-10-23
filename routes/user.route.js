const express = require("express");
const userRouter = express.Router();
const {
  signuppage,
  signup,
  loginpage,
  login,
  home,
} = require("../controllers/user.controller");

userRouter.get("/", signuppage);

userRouter.post("/register", signup);

userRouter.post("/log", login);

userRouter.get("/login", loginpage);

userRouter.get("/todo", home);

module.exports = userRouter;
