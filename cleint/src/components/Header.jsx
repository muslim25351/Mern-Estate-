import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center px-4 py-3 mx-auto max-w-6xl">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap ">
            <span className="text-slate-500">luxiary</span>
            <span className="text-slate-700"> RealEstate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />

          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex  gap-2">
          <Link to="/">
            <li className="hidden sm:inline hover:underline ">home</li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline hover:underline">about</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <li className="hover:underline">sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
