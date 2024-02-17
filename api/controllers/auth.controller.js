/* eslint-disable no-unused-vars */
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const userExists = await User.findOne({ username: username });
    const emailExists = await User.findOne({ email: email });
    if (userExists) return next(errorHandler(409, "Username already exists"));
    if (emailExists) return next(errorHandler(409, "Email already exists"));
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = newUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ success: true, user: rest });
  } catch (err) {
    if (err instanceof mongoose.MongooseError) {
      next(errorHandler(500, 'Mongo Server Error', '/auth/signin'));
    }
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userIdentifier = username ? {username} : {email};
    
    const userExists = await User.findOne(userIdentifier);
    if (!userExists) return next(errorHandler(404, "User not found!", 'auth/signin'));
    const validPassword = bcryptjs.compareSync(password, userExists.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET);
    userExists.password = undefined;
    userExists.__v = undefined;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 31),
      })
      .status(200)
      .json({
        success: true,
        user: userExists,
      });
  } catch (err) {
    if (err instanceof mongoose.MongooseError) {
      next(errorHandler(500, 'Mongo Server Error', '/auth/signin'));
    }
    next(err);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    next(error);
  }
};
