/* eslint-disable react/prop-types */
import React from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

export const ListingCard = ({ listing, listingDeleteHandler }) => {
  return (
    <div className="w-full max-w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 pt-2 m-auto">
      <Link to={`/listing/${listing._id}`}>
        <img
          className="p-8 rounded-t-lg"
          src={listing.imageUrls[0]}
          alt="product image"
          loading="lazy"
        />
      </Link>
      <div className="px-5 pb-5">
        <a href="#" className="flex gap-2 items-center mb-5">
          <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {listing.name}
          </h5>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-1.5 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800">
            {listing.type === "rent" ? "RENT" : "SALE"}
          </span>
        </a>
        <div className="flex items-center mt-2.5 mb-5">
          <div className="flex items-center space-x-1">
            {listing.offer && (
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                OFFER
              </span>
            )}
            {listing.parking > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                PARKING
              </span>
            )}
            {listing.furnished && (
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 uppercase">
                furnished
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {listing.offer ? (
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${listing.discountPrice}
            </span>
          ) : (
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${listing.regularPrice}
            </span>
          )}

          <div className="flex">
            <button
              onClick={() => listingDeleteHandler(listing._id)}
              className="mx-1 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
              <MdDelete className="h-5 w-5" />
            </button>
            <Link to={`/update-listings/${listing._id}`}>
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                EDIT
              </button>
            </Link>
          </div>
          {/* <a href="#" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</a> */}
        </div>
      </div>
    </div>
  );
};
