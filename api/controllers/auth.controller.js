import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({id : newUser._id}, process.env.JWT_SECRET);
        const {password: pass, ...rest} = newUser._doc;
        res.cookie('access_token', token, {httpOnly: true}).status(200).json({ success: true, user: rest});
    } catch (err) {
        next(err);
    }
};

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (!userExists) return next(errorHandler(404, 'User not found!'));
        const validPassword = bcryptjs.compareSync(password, userExists.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
        const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET);
        userExists.password = undefined;
        userExists.__v = undefined;
        res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
            .status(200)
            .json(
                {
                    success: true,
                    user: userExists,
                });
    } catch (err) {
        next(err);
    }
}

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json({success: true, message: 'User logged out'});
    } catch (error) {
        next(error);
    }
}