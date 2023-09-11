const express = require("express");
const { userModel } = require("../Models/userModel");
const { authenticate } = require("../auth/auth");
const userRoute = express.Router();

userRoute.post("/register", async (req, res) => {
  const { email} = req.body;
  try {
    //check if user already exist
    const userExist = await userModel.findOne({ email: email });
    if (userExist) {
      return res.json({
        success: false,
        message: "User already exist with given email",
      });
    }
    const user = await userModel.create(req.body);
    return res.json({
      success: true,
      message: "Registered successfully",
      user: user,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error in registration",
      error: error,
    });
  }
});

userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    ////check if user exist
    const userExist = await userModel.findOne({ email }).select("+password");
    if (!userExist) {
      return res.json({
        success: false,
        message: "Unable to login, please enter correct credentials",
      });
    }
    //match password
    const isMatch = await userExist.comparePassword(
      password,
      userExist.password
    );
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Unable to login, please enter correct credentials",
      });
    }
    const token = await userExist.generateJWT();
    return res.cookie("token", token,{httpOnly:false}).json({
      success: true,
      message: "LoggedIn successfully",
      user: userExist,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error in login",
      error: error,
    });
  }
});

userRoute.get("/logout", authenticate, async (req, res) => {
  return res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({ success: true, message: "Logged out successfully" });
});


module.exports = { userRoute };
