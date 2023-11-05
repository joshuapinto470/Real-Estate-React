import { check, oneOf } from 'express-validator';
import Joi from 'joi';

// export const validators = [
//     check('name').notEmpty().withMessage('Need to exist').isString().escape(),
//     check('description').notEmpty().escape(),
//     check('address').notEmpty().escape(),
//     check('regularPrice').notEmpty().isInt({min:0}),
//     check('discountPrice').notEmpty().isInt({min:0}),
//     check('bathrooms').notEmpty().isInt({min:0}),
//     check('bedrooms').notEmpty().isInt({min:0}),
//     check('furnished').notEmpty().isBoolean(),
//     check('parking').notEmpty().isBoolean(),
//     oneOf([
//         check('type').notEmpty().isString().trim().equals('rent'),
//         check('type').notEmpty().isString().trim().equals('sale'),
//     ], 'type needs to be either sale or rent'),
//     check('offer').notEmpty().isBoolean(),
//     check('userRef').notEmpty()
// ];

export const validateListingSchema = Joi.object({
    name : Joi.string().min(3).required(),
    description: Joi.string().min(5).required(),
    address: Joi.string().min(2).required(),
    regularPrice: Joi.number().min(0).required(),
    discountPrice: Joi.number().min(0).required(),
    bathrooms: Joi.number().integer().min(0).required(),
    bedrooms: Joi.number().integer().min(0).required(),
    furnished: Joi.boolean().required(),
    parking: Joi.boolean().required(),
    offer: Joi.boolean().required(),
    type: Joi.string().required(),
    userRef: Joi.string().required()
});