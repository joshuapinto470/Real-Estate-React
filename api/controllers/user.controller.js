import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';

export const updateUser = async (req, res, next) => {
    try {
        console.log(JSON.stringify(req.body));
        const userId = req.user.id;
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatarFileName,
            }
        }, {runValidators: true, new: true});

        const {password, ...rest} = updateUser._doc;
        res.status(200).json({
            success: true,
            user: rest,
        });

    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await User.findByIdAndDelete(userId);
        // req.cookies.access_token = null;
        res.clearCookie('access_token');
        res.status(200).json({'success' : true, 'message' : 'User has been deleted'});
    } catch (error) {
        next(error)
    }
}