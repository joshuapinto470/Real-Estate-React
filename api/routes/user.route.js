import express from 'express';
import { deleteUser, updateUser } from '../controllers/user.controller.js';
import fileUpload from '../middleware/uploadFile.middleware.js';
import { verifyToken } from '../middleware/auth.middleware.js'

const userRouter = express.Router();

userRouter.post('/updateUser', verifyToken, fileUpload.single('avatar'), updateUser);
userRouter.delete('/deleteUser', verifyToken, deleteUser);

export default userRouter;