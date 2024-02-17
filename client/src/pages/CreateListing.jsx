import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 5000,
        discountPrice: 4999,
        offer: false,
        parking: false,
        furnished: false,
        userRef: "user",
    });

    // const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.id === "sale" || e.target.id === "rent") {
            setFormData({
                ...formData,
                type: e.target.id,
            });
            return;
        }

        if (
            e.target.id === "parking" ||
            e.target.id === "furnished" ||
            e.target.id === "offer"
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
            return;
        }

        if (
            e.target.type === "number" ||
            e.target.type === "text" ||
            e.target.type === "textarea"
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };

    const handleFileUpload = (e) => {
        e.preventDefault();
        if (loading || uploading) return;
        setUploading(true);
        setFiles(e.target.files);
        let imageUrls = [];

        for (let i = 0; i < files.length; i++) {
            imageUrls.push({
                fileURI: URL.createObjectURL(files[i]),
                fileName: files[i].name,
            });
        }

        setFormData({ ...formData, imageUrls: imageUrls });
        setUploading(false);
        return;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading || uploading) return;
        try {
            if (files.length < 1)
                return setError("You must upload atleast 1 image!");
            if (formData.regularPrice < formData.discountPrice)
                return setError(
                    "Discounted price cannot be higher than regular price!"
                );
            setError(null);
            setLoading(true);
            const multipartData = new FormData();
            multipartData.append("name", formData.name);
            multipartData.append("description", formData.description);
            multipartData.append("address", formData.address);
            multipartData.append("type", formData.type);
            multipartData.append("bedrooms", formData.bedrooms);
            multipartData.append("bathrooms", formData.bathrooms);
            multipartData.append("furnished", formData.furnished);
            multipartData.append("parking", formData.parking);
            multipartData.append("regularPrice", formData.regularPrice);
            multipartData.append("discountPrice", formData.discountPrice);
            multipartData.append("offer", formData.offer);
            multipartData.append("userRef", formData.userRef);

            for (const file of files) {
                multipartData.append("gallery", file);
            }

            const options = {
                method: "POST",
                body: multipartData,
            };

            const res = await fetch("/api/listing/create", options);
            if (res.status >= 400) {
                switch (res.status) {
                    case 401:
                        console.warn("Error request " + res.status);
                        setLoading(false);
                        setUploading(false);
                        navigate("/");
                        break;
                    default:
                        console.warn(res);
                        throw new Error("Error request " + res.status);
                }

                // throw new Error("Error request: " + res.status);
            }
            const data = await res.json();
            if (!data.success) {
                setError(data);
                setLoading(false);
                return;
            }
            setLoading(false);
            navigate("/display-listing");
        } catch (error) {
            console.error(error);
            setError(error);
            setLoading(false);
        }
    };

    return (
        <main className="p-3 max-w-5xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">
                Create a listing
            </h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        placeholder="Property Name"
                        className="border p-3 rounded-lg"
                        id="name"
                        maxLength="62"
                        minLength={10}
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        className="border p-3 rounded-lg"
                        id="description"
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />

                    <input
                        type="text"
                        placeholder="Address"
                        className="border p-3 rounded-lg"
                        id="address"
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />

                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2 flex-wrap">
                            <input
                                type="checkbox"
                                className="w-4"
                                id="sale"
                                onChange={handleChange}
                                checked={formData.type === "sale"}
                            />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-4"
                                id="rent"
                                onChange={handleChange}
                                checked={formData.type === "rent"}
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-4"
                                id="parking"
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-4"
                                id="furnished"
                                onChange={handleChange}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-4"
                                id="offer"
                                onChange={handleChange}
                                checked={formData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                className="p-3 border border-gray-300 rounded-lg"
                                id="bedrooms"
                                value={formData.bedrooms}
                                min={0}
                                max={55}
                                required
                                onChange={handleChange}
                            />
                            <span>Bed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                className="p-3 border border-gray-300 rounded-lg"
                                id="bathrooms"
                                value={formData.bathrooms}
                                min={0}
                                max={50}
                                required
                                onChange={handleChange}
                            />
                            <span>Bath</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                className="p-3 border border-gray-300 rounded-lg"
                                id="regularPrice"
                                value={formData.regularPrice}
                                min={1000}
                                required
                                onChange={handleChange}
                            />
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                {formData.type === "rent" && (
                                    <span className="text-xs">(₹ / month)</span>
                                )}
                            </div>
                        </div>
                        {formData.offer && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    className="p-3 border border-gray-300 rounded-lg"
                                    id="discountPrice"
                                    value={formData.discountPrice}
                                    min={0}
                                    max={formData.regularPrice - 1}
                                    required
                                    onChange={handleChange}
                                />
                                <div className="flex flex-col items-center">
                                    <p>Discounted Price</p>
                                    {formData.type === "rent" && (
                                        <span className="text-xs">
                                            (₹ / month)
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">
                        Images:
                        <span className="font-normal text-gray-600 ml-2">
                            The first image will be the cover
                        </span>
                    </p>
                    <div className="flex gap-4 flex-wrap">
                        <input
                            onChange={handleFileUpload}
                            className="block p-3 text-gray-900 border 
                        border-gray-300 rounded-lg 
                        cursor-pointer bg-gray-50 file:mr-2 file:rounded-md
                         file:bg-gray-800 file:text-white file:p-2 
                         file:border-none"
                            type="file"
                            id="images"
                            accept="images/*"
                            multiple
                        />
                    </div>
                    {formData.imageUrls.length > 0 &&
                        formData.imageUrls.map((url) => (
                            <div
                                key={url}
                                className="flex justify-between p-3 border rounded-md"
                            >
                                <img
                                    src={url.fileURI}
                                    alt="listing image"
                                    className="w-20 h-20 object-contain rounded-md"
                                />
                                <p className="font-normal text-gray-600 mx-2 m-auto">
                                    {url.fileName}
                                </p>
                                <button className="p-3 text-red-700 rounded-md uppercase hover:opacity-70 hover:bg-red-800 hover:text-slate-100 m-auto">
                                    Delete
                                </button>
                            </div>
                        ))}
                    <button
                        disabled={loading || uploading}
                        className="p-3 bg-slate-700 text-white rounded-lg
                                    uppercase hover:opacity-95 disabled:opacity-80"
                    >
                        Create Listing
                    </button>
                    {error && <p className='text-white p-2 rounded-md text-sm text-center bg-red-600 max-w-fit mx-auto'>⚠️ {error.message}</p>}
                </div>
            </form>
        </main>
    );
};

export default CreateListing;
