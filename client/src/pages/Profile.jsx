import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { ListingCard } from "../components/ListingCard.jsx";
import {
    userUpdateStart,
    userUpdateSuccess,
    userUpdateFailure,
    userDeleteFailure,
    userDeleteSuccess,
} from "../redux/user/userSlice.js";

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
                        <ListingCard
                            key={listing._id}
                            listing={listing}
                            listingDeleteHandler={handleListingDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
