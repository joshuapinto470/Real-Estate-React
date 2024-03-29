import React from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const userData = currentUser?.user;
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Joshua </span>
            <span className="text-slate-700">RealEstate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-md flex items-center" id="search-box">
          <input
            type="text"
            placeholder="Search..."
            id="search"
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>

        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          {userData ? (
            <Link to="/profile">
              <img
                src={userData?.avatar}
                alt="profile pic"
                className="h-7 w-7 object-cover rounded-full"
              />
            </Link>
          ) : (
            <Link to="/sign-in">
              <li className="sm:inline text-slate-700 hover:underline">
                Sign In
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
