import { isValidObjectId } from "mongoose";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import { validateListingSchema } from "../validators/listing.validator.js";
import jwt from 'jsonwebtoken';

export const createListing = async (req, res, next) => {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const { error, value } = validateListingSchema.validate(data);
        console.log(value);
        if (error) {
            console.log(error);
            return next(errorHandler(400, error.details[0].message));
        }
        // req.user.id = "TEST ID"

        const images = req.files.gallery;
        const imageUrls = [];
        console.log(images);
        if (Array.isArray(images)) {
            images.forEach((i) => {
                imageUrls.push("http://localhost:3000/assets/" + i.filename);
            });
        } else {
            return next(errorHandler(500, "No images uploaded"));
        }

        value.imageUrls = imageUrls;
        value.userRef = req.user.id;
        // value.userRef = "TEST ID"
        const listing = await Listing.create(value);
        await listing.save();

        return res.status(201).json({ success: true, data: listing });
    } catch (error) {
        next(error);
    }
};

// Get a single listing
export const getListing = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.listingId)) {
            return next(errorHandler(400, "Invalid Listing ID"));
        }

        const listing = await Listing.findById(req.params.listingId);
        /*
        See if this is a authenticated request.
        If so then set the isEditable flag to true if the post belongs 
        to the current user.
        */
        let userId = null;
        const token = req.cookies?.access_token;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (!err) {
                    userId = user.id;
                } 
            })
        }
        if (!listing) return next(errorHandler(404, "Listing Not Found!"));

        // listing['isEditable'] = listing.userRef !== userId;

        return res.status(200).json({
            success: true,
            data: {
                isEditable: listing.userRef === userId,
                listing: listing._doc,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Fetch all the listings
export const fetchListing = async (req, res, next) => {
    try {
        const listing = await Listing.find({}).lean();
        // const {__v, ...rest} = listing._doc;
        res.status(200).json({ status: "ok", data: listing });
    } catch (error) {
        next(error);
    }
};

/*
Delets the user listing.
This currently does not delete the images associated with the listing ;(
*/
export const deleteListing = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.listingId)) {
            return next(errorHandler(400, "Invalid Listing ID"));
        }

        const listing = await Listing.findById(req.params.listingId);
        const userId = req.user.id;

        if (!listing) {
            return next(errorHandler(404, "Listing Not Found!"));
        }

        if (listing.userRef !== userId) {
            return next(
                errorHandler(
                    401,
                    "Illegal! Listing specified does not belong to user."
                )
            );
        }

        await Listing.findByIdAndDelete(listing._id);
        res.status(200).json({
            success: true,
            message: `Listing with id: ${listing._id} deleted`,
        });
    } catch (error) {
        next(error);
    }
};

export const updateListing = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.listingId)) {
            return next(errorHandler(400, "Invalid Listing ID"));
        }

        const listing = await Listing.findById(req.params.listingId);
        const userId = req.user.id;

        if (!listing) {
            return next(
                errorHandler(404, `Listing ${req.params.listingId} not found!`)
            );
        }

        if (listing.userRef !== userId) {
            return next(
                errorHandler(
                    401,
                    "Illegal! Listing specified does not belong to user."
                )
            );
        }

        const data = JSON.parse(JSON.stringify(req.body));
        const { error, value } = validateListingSchema.validate(data);
        console.log(value);
        if (error) {
            console.log(error);
            return next(errorHandler(400, error.details[0].message));
        }
    } catch (error) {
        next(error);
    }
};
