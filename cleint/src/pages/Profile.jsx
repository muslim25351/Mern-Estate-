import React from "react";
import { useSelector } from "react-redux";
import { useRef, useEffect, useState } from "react";
import { storage } from "../appWrite/appwriteconfig";
import { ID, Permission, Role } from "appwrite";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [err, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    try {
      const fileId = ID.unique(); // Generates a unique ID
      const response = await storage.createFile(
        "67da80dd0029ad1cb1ae",
        fileId,
        file,
        [Permission.read(Role.any())],
        setUploadProgress(-1)
      );
      console.log("Upload successful:", response);

      const imageUrl = storage.getFileView(
        "67da80dd0029ad1cb1ae",
        response.$id
      );

      setImageUrl(imageUrl);
      setFormData({ ...formData, avatar: imageUrl });
      setUploadProgress(0);

      //console.log(imageUrl);
    } catch (error) {
      setError(error);
      console.error("Upload failed:", error);
      setUploadProgress(0); // Reset progress on error
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response data:", data);

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message || "Something went wrong."));
    }
  };

  console.log("Loading:", loading);
  console.log("Error:", error);

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center  font-semibold py-3">profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 ">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          key={imageUrl}
          onClick={() => fileRef.current.click()}
          src={imageUrl || currentUser.avatar}
          alt="profile"
          className="rounded-full  h-24 w-24  object-cover self-center cursor-pointer"
        />
        {err ? (
          <span className="text-red-700 text-center">{err.message}</span>
        ) : uploadProgress === -1 ? (
          <span className="text-slate-700 animate-pulse text-center">
            Uploading...
          </span>
        ) : uploadProgress === 0 && imageUrl ? (
          <span className="text-green-700 text-center">Upload complete!</span>
        ) : null}

        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="p-3  rounded-lg bg-white  focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
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
        <button
          disabled={loading}
          className="text-white bg-slate-700 p-3 cursor-pointer rounded-lg hover:opacity-95 disabled:opacity-80 uppercase"
        >
          {loading ? "loading..." : "update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">sign out</span>
      </div>
      <p className="text-red-700 text-center mt-5">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "user is updated successfully!" : ""}
      </p>
    </div>
  );
}
