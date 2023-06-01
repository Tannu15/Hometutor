import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
    },


    email: {
      type: String,
      required: [true, "please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      default: null,
      required: [true, "please enter your password"],
      minLength: [8, "please enter max 8"],
    },
    phone: {
      type: String,
      required: true
    }, address: {
      type: String,
      required: true
    },
    course: {
      type: String, default: null
    }, subject: {
      type: String, default: null
    }
  },
  { timestamps: true }
);
schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashPassword = await bcrypt.hash(this.password, 10);
  this.password = hashPassword;
  next();
});

schema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

schema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
export const User = mongoose.model("User", schema);
