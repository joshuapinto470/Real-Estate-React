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