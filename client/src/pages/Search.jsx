import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItems from "../components/ListingItems";

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
  const [showMore, setShowMore] = useState(false);

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
      setShowMore(false);
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
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
          setLoading(false);
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
  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col sm:flex-row  ">
      <div className=" p-7 border-b-2 border-gray-400 md:border-r-2  md:min-h-screen border-solid flex-1 ">
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
      <div className="flex-3 ">
        <h1 className="font-semibold text-2xl pl-3 mt-7 text-slate-70 shadow-md pb-2">
          Listing results :
        </h1>

        <div className="flex flex-wrap p-7 gap-y-4 gap-x-6 md:pl-9">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-center text-slate-700">
              No lisiting result found!
            </p>
          )}
          {loading && (
            <p className="text-xl text-center text-slate-700 w-full">
              loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItems key={listing._id} listing={listing} />
            ))}
        </div>
        {showMore && (
          <button
            onClick={onShowMoreClick}
            className="text-green-600 hover:underline px-7 pb-4"
          >
            show more
          </button>
        )}
      </div>
    </div>
  );
}
