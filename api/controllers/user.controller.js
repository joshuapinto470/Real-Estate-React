import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let avatarFileName = undefined;
        if (req.file) {
            console.log(req.file?.filename);
            avatarFileName =
                "http://localhost:3000/assets/" + req.file.filename;
        }
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: avatarFileName,
                },
            },
            { runValidators: true, new: true }
        ).lean();

        if (!updateUser) {
            return next(errorHandler(400, 'User not found!'));
        }

        const { password, ...rest } = updateUser;
        res.status(200).json({
            success: true,
            user: rest,
        });
    } catch (error) {
        if (error.name === "MongoServerError") {
            switch (error.code) {
                case 11000:
                    next(errorHandler(400, "Duplicate Key"));
                    break;
                default:
                    next(errorHandler(400, "Mongo Error"));
            }
        }
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await User.findByIdAndDelete(userId);
        // req.cookies.access_token = null;
        res.clearCookie("access_token");
        res.status(200).json({
            success: true,
            message: "User has been deleted",
        });
    } catch (error) {
        next(error);
    }
};

export const getUserListings = async (req, res, next) => {
    try {
        const userID = req.user.id;
        const listings = await Listing.find({ userRef: userID }).lean();
        res.status(200).json({ success: true, data: listings });
    } catch (error) {
        next(error);
    }
};
