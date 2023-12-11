import express from "express";
import {
    createListing,
    deleteListing,
    fetchListing,
    getListing,
    updateListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import fileUpload from "../middleware/uploadFile.middleware.js";

const router = express.Router();

const cpUpload = fileUpload.fields([{ name: "gallery", maxCount: 6 }]);

router.post("/create", verifyToken, cpUpload, createListing);

router.get("/fetch-listing", verifyToken, fetchListing);
router.get("/get/:listingId", getListing);
router.delete("/delete-listing/:listingId", verifyToken, deleteListing);
router.post("/update/:listingId", verifyToken, updateListing);

export default router;

/*
{
    "name" : "River View Apts",
    "description": "Nice apts",
    "address" : "C.A",
    "regularPrice" : 5000,
    "discountedPrice" : 4999,
    "bathrooms" : 0,
    "bedrooms" : 1,
    "furnished" : "true",
    "parking" : false,
    "type" : "rent",
    "offer" : false,
    "imageUrls" : [],
    "userRef" : "testurl"
}
*/
