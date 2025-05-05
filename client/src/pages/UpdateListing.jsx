import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ID } from "appwrite";
import { storage } from "../appWrite/appwriteconfig.js";
export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFile] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    parking: false,
    furnished: false,
    offer: false,
    regularPrice: 50,
    discountPrice: 0,
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
  });
  const [uploading, setUploading] = useState(false);

  const [imageUploadError, setImageUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      try {
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
        }
        setFormData(data);
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
    };
    fetchListing();
  }, []);

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setImageUploadError(false);
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      const promises = Array.from(files).map((file) => storeImage(file));

      try {
        const imageUrls = await Promise.all(promises);
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(imageUrls),
        });
        //console.log("All images uploaded successfully:", imageUrls);

        setImageUploadError(false);
        setUploading(false);
      } catch (error) {
        console.error("Error uploading images:", error);
        setImageUploadError("Image upload failed,(2 MB) MAX per image ");
      }
    } else {
      console.error("Please upload between 1 and 6 images.");
      setImageUploadError(
        "You can upload a minimum of 1 and a maximum of 6 images"
      );
      setUploading(false);
    }
  };
  // Function to store an image in storage
  const storeImage = async (file) => {
    try {
      const fileId = ID.unique(); // Generates a unique ID
      const response = await storage.createFile(
        "67da80dd0029ad1cb1ae",
        fileId,
        file
      );

      const imageUrl = storage.getFileView(
        "67da80dd0029ad1cb1ae",
        response.$id
      );
      console.log("Image URL:", imageUrl);
      return imageUrl; // Return the file URL
    } catch (error) {
      console.error("Error storing image:", error);
      //throw error;
    }
  };
  console.log("The data....", formData);
  // console.log("filesss....", files);

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("Please upload at least one image");
      if (+formData.discountPrice > +formData.regularPrice)
        return setError("Discounted price should be less than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);

      setLoading(false);
      setError(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  //console.log("curerneeee", currentUser);
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        update listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 px-3 flex-1">
          <input
            className="bg-white  p-3 rounded-lg " //focus:ouline-none
            type="text"
            placeholder="Name"
            id="name"
            required
            maxLength={32}
            minLength={5}
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            className="bg-white  p-3 rounded-lg"
            type="textarea"
            placeholder="Description"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            className="bg-white  p-3 rounded-lg"
            type="text"
            placeholder="Address"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="number"
                max="10"
                min="1"
                id="bedrooms"
                required
                onChange={handleChange}
                value={formData.bedrooms}
                className="p-3 border border-gray-300 bg-white rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                max="10"
                min="1"
                id="bathrooms"
                requried
                onChange={handleChange}
                value={formData.bathrooms}
                className="p-3 border border-gray-300 bg-white rounded-lg"
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                requried
                onChange={handleChange}
                value={formData.regularPrice}
                className="p-3 border border-gray-300 bg-white rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($/ month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-2">
                <input
                  type="number"
                  max="1000000"
                  min="0"
                  id="discountPrice"
                  requried
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="p-3 border border-gray-300 bg-white rounded-lg"
                />
                <div className=" flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($/ month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <div className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover
            </span>
          </div>
          <div className="flex  gap-4">
            <input
              onChange={(e) => setFile(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              className=" p-3 border border-gray-300 w-full rounded shadow-lg"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 rounded border border-green-700 hover:shadow-lg disabled:opacity-80 uppercase text-green-700 "
            >
              {uploading ? "uploading..." : "upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border border-gray-300 rounded-lg items-center"
              >
                <img
                  className="rounded-lg object-cover w-18 h-15"
                  src={url}
                  alt="listing image"
                />
                <button
                  type="button"
                  className="p-2 text-red-700 rounded-lg hover:opacity-75 uppercase"
                  onClick={() => handleRemoveImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 "
          >
            {loading ? "updating" : "update listing"}
          </button>
          <p className="text-red-700 text-sm">{error && error}</p>
        </div>
      </form>
    </main>
  );
}
