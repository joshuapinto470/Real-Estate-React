/* eslint-disable react/prop-types */
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TableListing = ({ listings }) => (
    <>
        {listings.map((l) => {
            const { regularPrice, discountPrice } = l;
            const percentageDiscount =
                (1 - discountPrice / regularPrice) * 100.0;

            return (
                <div
                    key={l.id}
                    className="bg-blue-500 text-white p-2 m-2 rounded-md max-w-fit flex flex-wrap"
                >
                    <p className="p-2 m-2">Name : {l.name}</p>
                    <p className="bg-red-600 p-2 rounded m-1">
                        Description : {l.description}
                    </p>
                    <p className="bg-red-600 p-2 rounded m-1">
                        Type : {l.type}
                    </p>
                    <p className="bg-red-600 p-2 rounded m-1">
                        Address : {l.address}
                    </p>
                    <p className="bg-red-600 p-2 rounded m-1">
                        Regular Price : {l.regularPrice}
                    </p>
                    <p className="bg-red-600 p-2 rounded m-1">
                        Discounted Price : {l.discountPrice}
                    </p>
                    {percentageDiscount > 2.5 && (
                        <p className="bg-green-500 p-2 rounded-md m-1">
                            Discount Percent:{" "}
                            {percentageDiscount.toPrecision(3)}%
                        </p>
                    )}
                    {l.imageUrls.map((url) => (
                        <img
                            key={url}
                            src={url}
                            alt="profile"
                            className="h-24 w-30 object-cover cursor-pointer self-center mt-2 mx-2"
                        />
                    ))}
                    <p className="bg-red-600 p-2 rounded m-1">
                        Furnished : {l.furnished ? "True" : "False"}
                    </p>
                    <p className="bg-red-600 p-2 rounded m-1">
                        Bedrooms : {l.bedrooms}
                    </p>
                    <p className="bg-red-600 p-2 rounded m-1">
                        Bathrooms : {l.bathrooms}
                    </p>
                    <p
                        className={`${
                            l.offer ? "bg-green-600" : "bg-red-600"
                        } p-2 rounded m-1`}
                    >
                        Offer: {l.offer ? "True" : "False"}
                    </p>
                </div>
            );
        })}
    </>
);

const DisplayListing = () => {
    const [listing, setListing] = useState([]);
    const navigate = useNavigate();

    const buttonHandler = async () => {
        try {
            const options = {
                method: "GET",
            };

            const res = await fetch("/api/listing/fetch-listing", options);
            if (!res.ok) {
                switch (res.status) {
                    case 401:
                    case 403:
                        navigate("/");
                        break;
                    default:
                        console.warn(res);
                        throw new Error("Error request " + res.status);
                }

                // throw new Error("Error request: " + res.status);
            }
            const data = await res.json();
            console.log(data.data);
            setListing(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-3 max-w-5xl mx-auto">
            <div className="text-center text-3xl">Display Your Listing</div>
            <div className="mx-auto">
                <button
                    onClick={buttonHandler}
                    className="p-2 bg-slate-700 text-white rounded-lg
                                    uppercase hover:opacity-95 disabled:opacity-80 mx-auto"
                >
                    Load Listings
                </button>

                <div>
                    <p>Listings</p>
                    <TableListing listings={listing} />
                </div>
            </div>
        </div>
    );
};

export default DisplayListing;
