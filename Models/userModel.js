const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name details"],
    minLen: [4, "Name should be minimum of 4 characters"],
    maxLen: [16, "Name should not be more than 16 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide Email detail"],
    unique: [
      true,
      "Please provide another Email, this is already exist in database",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
  },
  subscription: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  return next();
});

userSchema.methods.comparePassword = async function (password, dbPassword) {
  return await bcrypt.compare(password, dbPassword);
};
userSchema.methods.generateJWT = async function () {
  const token = jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_COOKIE_EXPIRE,
  });
  return token;
};

const userModel = mongoose.model("user", userSchema);

module.exports = { userModel };
