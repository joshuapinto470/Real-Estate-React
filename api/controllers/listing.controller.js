import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import { validateListingSchema } from '../validators/listing.validator.js';

export const createListing = async (req, res, next) => {
    try {
        const data = JSON.parse(JSON.stringify(req.body))
        const {error, value} = validateListingSchema.validate(data);
        console.log(value)
        if (error){
            console.log(error);
            return next(errorHandler(400, error.details[0].message));
        }
        // req.user.id = "TEST ID"
        
        const images = req.files.gallery;
        const imageUrls = []
        console.log(images)
        if (Array.isArray(images)){
            images.forEach(i => {
                imageUrls.push('http://localhost:3000/assets/' + i.filename);
            })
        } else {
            return next(errorHandler(500, 'No images uploaded' ));
        }

        value.imageUrls = imageUrls;
        // value.userRef = req.user.id;
        value.userRef = "TEST ID"
        const listing = await Listing.create(value);
        await listing.save();

        return res.status(201).json({"status": "OK", "data": listing});
    } catch (error) {
        next(error);
    }
}

export const fetchListing = async (req, res) => {
    try {
        const listing = await Listing.find({});
        res.status(200).json({status: "ok", "data" : listing});
    } catch (error) {
        next(error)
    }
}