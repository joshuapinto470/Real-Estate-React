import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
    userUpdateStart,
    userUpdateSuccess,
    userUpdateFailure,
    userDeleteFailure,
    userDeleteSuccess,
} from "../redux/user/userSlice.js";
import { MdDelete } from "react-icons/md";

const PreviewCard = ({ listing }) => {
    return (
        <div
            key={listing._id}
            className={`border rounded-lg p-3 flex justify-between items-center gap-4 ${
                listing.offer ? "bg-green-200 shadow-md border-none" : ""
            }`}
        >
            <Link to={`/update-listings/${listing._id}`} className="flex gap-4">
                <img
                    src={listing.imageUrls[0]}
                    alt="listings"
                    className="h-28 w-28 object-contain"
                />
                <div>
                    <p className="text-slate-700 font-semibold hover:underline text-ellipsis text-lg mt-4">
                        {listing.name}
                    </p>
                    <p className={`${listing.offer ? "line-through" : ""}`}>
                        ${listing.regularPrice}
                    </p>
                    {listing.offer && (
                        <p className="text-slate-800">
                            ${listing.discountPrice}
                        </p>
                    )}
                </div>
            </Link>
            <div className="flex flex-col items-center gap-1">
                <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-slate-100 uppercase bg-red-700 p-2 rounded-md hover:opacity-80"
                >
                    <MdDelete />
                </button>
                <Link to={`/update-listings/${listing._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                </Link>
            </div>
        </div>
    );
};

const Profile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const user = currentUser.user;
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [formData, setFormData] = useState({});
    const [listings, setListings] = useState([]);
    const { loading, error } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleAvatarUpload = (file) => {
        setFile(file);
        setFormData({ ...formData, avatar: URL.createObjectURL(file) });
    };

    const handleDeleteUser = async () => {
        if (loading) return;
        try {
            dispatch(userUpdateStart());
            const options = {
                method: "DELETE",
            };

            const res = await fetch("api/user/deleteUser", options);
            const data = await res.json();
            if (data.success === false) {
                dispatch(userDeleteFailure(data));
                return;
            }
            dispatch(userDeleteSuccess());
            navigate("/");
        } catch (error) {
            dispatch(userDeleteFailure(error));
        }
    };

    const handleListingDelete = async (id) => {
        try {
            const res = await fetch(`/api/listing/delete-listing/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (data.success === false) {
                console.error(data);
                return;
            }

            setListings((prev) => prev.filter((listing) => listing._id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    const showListings = async () => {
        try {
            const res = await fetch("/api/user/listings");
            const data = await res.json();
            if (data.success === false) {
                console.warn(data);
                return;
            }

            console.log(data);
            setListings(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSignOut = async () => {
        if (loading) return;
        console.log("loggin out");
        try {
            dispatch(userUpdateStart());
            const res = await fetch("/api/auth/signout");
            const data = await res.json();
            if (data.success === false) {
                dispatch(userDeleteFailure(data.message));
                return;
            }
            dispatch(userDeleteSuccess());
            navigate("/");
        } catch (error) {
            dispatch(userDeleteFailure(error));
        }
    };

    const handleFormSubmit = async (e) => {
        if (loading) return;
        e.preventDefault();
        try {
            // Upload form to server.
            dispatch(userUpdateStart());
            const multipartData = new FormData();

            formData.email && multipartData.append("email", formData.email);

            formData.username &&
                multipartData.append("username", formData.username);

            formData.password &&
                multipartData.append("password", formData.password);

            file && multipartData.append("avatar", file);

            const options = {
                method: "POST",
                credentials: "include",
                body: multipartData,
            };

            const res = await fetch("/api/user/updateUser", options);
            const data = await res.json();
            if (data.success === false) {
                dispatch(userUpdateFailure(data));
                return;
            }
            dispatch(userUpdateSuccess(data));
        } catch (error) {
            dispatch(userUpdateFailure(error));
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7 truncate">
                Hello 👋 {user.username}!
            </h1>
            <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                <input
                    onChange={(e) => handleAvatarUpload(e.target.files[0])}
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                />
                <img
                    onClick={() => fileRef.current.click()}
                    src={formData.avatar || user.avatar}
                    alt="profile"
                    className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                />

                <input
                    type="text"
                    placeholder={user.username}
                    id="username"
                    className="border p-3 rounded-lg mt-2"
                    onChange={handleChange}
                ></input>
                <input
                    type="email"
                    placeholder={user.email}
                    id="email"
                    className="border p-3 rounded-lg mt-2"
                    onChange={handleChange}
                ></input>
                <input
                    type="password"
                    placeholder="Change Password"
                    id="password"
                    className="border p-3 rounded-lg mt-2"
                    onChange={handleChange}
                ></input>
                <button
                    disabled={loading}
                    className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
                >
                    Update
                </button>
                <Link
                    className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
                    to="/create-listing"
                >
                    Create Listing
                </Link>
            </form>
            <div className="flex justify-between mt-5">
                <span
                    onClick={handleDeleteUser}
                    className="text-red-700 cursor-pointer hover:bg-red-700 hover:text-white p-2 rounded-lg"
                >
                    Delete Account
                </span>
                <span
                    onClick={handleSignOut}
                    className="text-red-700 cursor-pointer hover:bg-blue-500 hover:text-white p-2 rounded-lg"
                >
                    Sign Out
                </span>
            </div>
            {error && (
                <p className="text-center">Error: {error.message?.message}</p>
            )}
            <button className="text-green-700 w-full" onClick={showListings}>
                Show Listing
            </button>
            {listings && listings.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h1 className="text-center mt-7 text-2xl font-semibold">
                        Your Listings
                    </h1>
                    {listings.map((listing) => (
                        <div
                            key={listing._id}
                            className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 pt-2"
                        >
                            <a href="#">
                                <img
                                    className="p-8 rounded-t-lg"
                                    src={listing.imageUrls[0]}
                                    alt="product image"
                                />
                            </a>
                            <div className="px-5 pb-5">
                                <a href="#">
                                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                        {listing.name}
                                    </h5>
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
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        ${listing.regularPrice}
                                    </span>
                                    <div className="flex">
                                        <button
                                            onClick={() =>
                                                handleListingDelete(listing._id)
                                            }
                                            className="mx-1 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                        >
                                            <MdDelete className="h-5 w-5" />
                                        </button>
                                        <Link
                                            to={`/update-listings/${listing._id}`}
                                        >
                                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                EDIT
                                            </button>
                                        </Link>
                                    </div>
                                    {/* <a href="#" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</a> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
