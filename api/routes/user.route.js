import express from "express";
import {
    deleteUser,
    updateUser,
    getUserListings,
} from "../controllers/user.controller.js";
import fileUpload from "../middleware/uploadFile.middleware.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post(
    "/updateUser",
    verifyToken,
    fileUpload.single("avatar"),
    updateUser
);
userRouter.delete("/deleteUser", verifyToken, deleteUser);
userRouter.get("/listings", verifyToken, getUserListings);

export default userRouter;
