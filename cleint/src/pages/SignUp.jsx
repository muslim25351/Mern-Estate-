import React from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="max-w-lg mx-auto px-3">
      <h1 className="text-3xl text-center my-7 font-semibold">sign up</h1>
      <form className="flex flex-col gap-3 ">
        <input
          type="text"
          placeholder="username"
          id="username"
          className="p-3 rounded-lg bg-white focus:outline-none"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="p-3 rounded-lg bg-white focus:outline-none"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="p-3 rounded-lg bg-white focus:outline-none"
        />
        <button className="p-3 rounded-lg uppercase text-white bg-slate-700 hover:opacity-95 disabled-75">
          sign up
        </button>
      </form>
      <div className="flex gap-2 mt-2">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">sign in</span>
        </Link>
      </div>
    </div>
  );
}
