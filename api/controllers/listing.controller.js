import { MongooseError, isValidObjectId } from "mongoose";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import {
  validateListingSchema,
  validateUpdateListingSchema,
} from "../validators/listing.validator.js";
import jwt from "jsonwebtoken";
import { uploadToFirebase } from "../utils/firebase_storage_upload.js";

export const createListing = async (req, res, next) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body));
    const { error, value } = validateListingSchema.validate(data);
    if (error) {
      console.log(error);
      return next(
        errorHandler(400, error.details[0].message, "/listing/create")
      );
    }

    const images = req.files.gallery;
    if (!images || !Array.isArray(images))
      return next(errorHandler(500, "Image upload error!", "/listing/create"));

    let imageUrls = [];

    // Firebase upload
    let requests = images.map((image) => uploadToFirebase(image));
    await Promise.all(requests)
      .then((responses) => {
        responses.forEach((link) => imageUrls.push(link));
      })
      .catch((err) => {
        throw new Error(err);
      });

    value.imageUrls = imageUrls;
    value.userRef = req.user.id;
    const listing = await Listing.create(value);
    await listing.save();

    return res.status(201).json({ success: true, data: listing });
  } catch (error) {
    if (error instanceof MongooseError) {
      next(errorHandler(500, "Mongo Server Error", "/auth/signin"));
    }
    next(error);
  }
};

/*
    if (Array.isArray(images)) {
        images.forEach((i) => {
            imageUrls.push("http://localhost:3000/assets/" + i.filename);
        });
    } else {
        return next(errorHandler(500, "No images uploaded", '/listing/create'));
    }
*/

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
      });
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
    if (error instanceof MongooseError) {
      next(errorHandler(500, "Mongo Server Error", "/auth/signin"));
    }
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
Deletes the user listing.
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
        errorHandler(401, "Illegal! Listing specified does not belong to user.")
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

/**
 * Updates the user listing respecting the Listing schema.
 * @param {HttpRequest} req Express HTTP request
 * @param {HttpResponse} res Express HTTP response
 * @param {ExpressMiddleware} next The next middleware to execute
 */
export const updateListing = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.listingId)) {
      return next(errorHandler(400, "Invalid Listing ID"));
    }

    const listing = await Listing.findById(req.params.listingId);
    const userId = req.user.id;

    if (!listing) {
      return next(
        errorHandler(
          404,
          `Listing ${req.params.listingId} not found!`,
          "/update/:listingId"
        )
      );
    }

    if (listing.userRef !== userId) {
      return next(
        errorHandler(
          401,
          "Illegal! Listing specified does not belong to user.",
          "/update/:listingId"
        )
      );
    }

    const data = JSON.parse(JSON.stringify(req.body));
    const { error, value } = validateUpdateListingSchema.validate(data);

    console.log(value);
    if (error) {
      console.log(error);
      return next(errorHandler(400, error.details[0].message));
    }

    const updatedListing = listing.updateOne(
      {
        $set: {
          name: value.name,
          description: value.description,
          address: value.address,
          regularPrice: value.regularPrice,
          discountedPrice: value.discountedPrice,
        },
      },
      { runValidators: true, new: true }
    );

    return res.status(200).json({ success: true, data: updatedListing });
  } catch (error) {
    next(error);
  }
};