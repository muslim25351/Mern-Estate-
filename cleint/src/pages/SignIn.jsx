import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-3">
      <h1 className="text-3xl text-center my-7 font-semibold">sign in</h1>
      <form className="flex flex-col gap-3 " onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          id="email"
          className="p-3 rounded-lg bg-white focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="p-3 rounded-lg bg-white focus:outline-none"
          onChange={handleChange}
        />
        <button className="p-3 rounded-lg uppercase text-white bg-slate-700 hover:opacity-95 disabled-75">
          {loading ? "loading..." : "sign in"}
        </button>
      </form>
      <div className="flex gap-2 mt-2">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
