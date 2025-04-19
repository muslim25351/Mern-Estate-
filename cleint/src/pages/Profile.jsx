import React from "react";
import { useSelector } from "react-redux";
import { useRef, useEffect, useState } from "react";
import { storage } from "../appWrite/appwriteconfig";
import { ID, Permission, Role } from "appwrite";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [err, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showErrorListing, setShowErrorListing] = useState(false);
  const [userListings, setUserListings] = useState([]);

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
  //console.log(formData);

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
      dispatch(updateUserFailure(err.message));
    }
  };
  console.log("the form data", formData);
  const handleDeleteUser = async () => {
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout"); //no need to explicitly write get method
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (err) {
      dispatch(signOutUserFailure(err.message));
    }
  };
  const handleShowListing = async () => {
    //e.preventDefault();
    try {
      setShowErrorListing(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      if (!res.ok) {
        setShowErrorListing(true);
        return;
      }
      const data = await res.json();
      //console.log(`/api/user/listings/${currentUser._id}`); // Should be the same as the one you test in Insomnia

      if (data.success === false) {
        setShowErrorListing(true);
        return;
      }
      setUserListings(data);
      // console.log("the data log", data);
    } catch (err) {
      setShowErrorListing(true);
      console.log(err);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (err) {
      console.log(err.message);
    }
  };
  console.log(currentUser._id);
  console.log("the listing", userListings);
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
        <Link
          className="bg-green-600 text-white rounded-lg text-center p-3 hover:opacity-95 uppercase"
          to={"/create-listing"}
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          sign out
        </span>
      </div>
      <p className="text-red-700 text-center mt-5">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "user is updated successfully!" : ""}
      </p>
      <div className="flex justify-center">
        <button onClick={handleShowListing} className="text-green-800 ">
          Show Listings
        </button>
      </div>
      <p className="text-red-700">
        {showErrorListing ? "Error in listing" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-y-4 ">
          <h1 className="text-lg  text-center font-semibold py-2">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className=" flex justify-between items-center p-3 border border-slate-300 rounded-lg gap-3 shadow-sm"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="image cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700  hover:underline truncate flex-1 font-semibold"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center ">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700"
                >
                  DELETE
                </button>
                <button className="text-green-700">EDIT</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
