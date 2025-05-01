import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebar, setSidebar] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(false);
  console.log(listings);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebar({ ...sidebar, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebar({
        ...sidebar,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "searchTerm") {
      setSidebar({ ...sidebar, searchTerm: e.target.value });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebar({ ...sidebar, sort, order });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebar.searchTerm);
    urlParams.set("type", sidebar.type);
    urlParams.set("parking", sidebar.parking);
    urlParams.set("furnished", sidebar.furnished);
    urlParams.set("offer", sidebar.offer);
    urlParams.set("sort", sidebar.sort);
    urlParams.set("order", sidebar.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get("searchTerm");
    const typeFormUrl = urlParams.get("type");
    const parkingFormUrl = urlParams.get("parking");
    const furnishedFormUrl = urlParams.get("furnished");
    const offerFormUrl = urlParams.get("offer");
    const sortFormUrl = urlParams.get("sort");
    const orderFormUrl = urlParams.get("order");

    if (
      searchTermFormUrl ||
      typeFormUrl ||
      parkingFormUrl ||
      furnishedFormUrl ||
      offerFormUrl ||
      sortFormUrl ||
      orderFormUrl
    ) {
      setSidebar({
        searchTerm: searchTermFormUrl || "",
        type: typeFormUrl || "all",
        parking: parkingFormUrl === "true" ? true : false,
        furnished: furnishedFormUrl === "true" ? true : false,
        offer: offerFormUrl === "true" ? true : false,
        sort: sortFormUrl || "created_at",
        order: orderFormUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      try {
        const searchQuery = urlParams.toString();
        // console.log("Fetching from:", `/api/listing/get?${searchQuery}`);
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        console.log("the data: ", data);
        if (data.success === false) {
          setLoading(false);
          setError(true);
          return;
        }
        setListings(data);
        setLoading(false);
      } catch (err) {
        setError(true);
        console.log(err);
      }
    };
    fetchListings();
  }, [location.search]);
  return (
    <div className="flex flex-col md:flex-row  ">
      <div className=" p-7 border-b-2 border-gray-400 md:border-r-2  md:min-h-screen border-solid  ">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              search Term
            </label>
            <input
              type="text"
              placeholder="search..."
              id="searchTerm"
              className="border rounded-lg bg-white p-3 w-full"
              onChange={handleChange}
              value={sidebar.searchTerm}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebar.type === "all"}
              />
              <span>Rent & Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebar.type === "rent"}
              />
              <span>Rent </span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebar.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebar.offer}
              />
              <span>offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebar.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebar.furnished}
              />
              <span>Furnished </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="bg-white rounded-lg p-2"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc"> Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="p-3 rounded-lg bg-slate-700 text-white uppercase hover:opacity-95 ">
            Search
          </button>
        </form>
      </div>
      <div className="font-semibold text-2xl text-center mt-7 text-slate-700">
        <h1>Listing results</h1>
      </div>
    </div>
  );
}
