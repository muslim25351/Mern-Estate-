import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center  font-semibold py-3">profile</h1>

      <form className="flex flex-col gap-3 ">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full  h-24 w-24  object-cover self-center cursor-pointer"
        />
        <input
          type="text"
          placeholder="username"
          id="username"
          className="p-3  rounded-lg bg-white  focus:outline-none"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="p-3 rounded-lg bg-white focus:outline-none"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="p-3 rounded-lg bg-white focus:outline-none"
        />
        <button className="text-white bg-slate-700 p-3 rounded-lg hover:opacity-95 disabled:opacity-80 uppercase">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">sign out</span>
      </div>
    </div>
  );
}
