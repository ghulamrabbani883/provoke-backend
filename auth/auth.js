const jwt = require("jsonwebtoken");
const { userModel } = require("../Models/userModel");
const authenticate = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, mgs: "Please login to access the resource" });
    }
    const verify = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = await userModel.findById(verify.id);
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { authenticate };
