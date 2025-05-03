import React from "react";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

export default function ListingItems({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden w-[220px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className="h-[210px] sm:h-[180px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <p className="truncate text-lg font-semibold p-2">{listing.name}</p>
        <div className="flex items-center gap-1">
          <MdLocationOn className="h-4 w-4 text-green-700" />
          <p className="text-sm text-gray-700 truncate">{listing.address}</p>
        </div>
        <p className="text-sm line-clamp-2 text-gray-600 pl-1.5">
          {listing.description}
        </p>
        <p className="pl-1.5 mt-2 text-slate-600 font-semibold">
          $
          {listing.offer
            ? (listing.regularPrice - listing.discountPrice).toLocaleString(
                "en-US"
              )
            : listing.regularPrice.toLocaleString("en-US")}
          {listing.type === "rent" && "/month"}
        </p>
        <div className="flex text-slate-700 gap-3">
          <div className="pl-2 text-sm font-semibold">
            {listing.bedrooms > 1
              ? `${listing.bedrooms} beds`
              : `${listing.bedrooms} bed`}
          </div>
          <div className="pl-2 text-sm font-semibold">
            {listing.bathrooms > 1
              ? `${listing.bathrooms} baths`
              : `${listing.bathrooms} bath`}
          </div>
          <div className=""></div>
        </div>
      </Link>
    </div>
  );
}
