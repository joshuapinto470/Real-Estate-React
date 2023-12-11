import Joi from "joi";

export const validateListingSchema = Joi.object({
    name: Joi.string().min(3).required(),
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
    userRef: Joi.string().required(),
});
