import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItems from "../components/ListingItems";
import { FaTelegram, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

export default function Home() {
  SwiperCore.use([Navigation]);
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  console.log(offerListing);
  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListing(data);
        fetchRentListing();
      } catch (err) {
        console.log(err);
      }
    };
    const fetchRentListing = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListing(data);
        fetchSaleListing();
      } catch (err) {
        console.log(err);
      }
    };
    const fetchSaleListing = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListing(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOfferListing();
  }, []);
  return (
    <div>
      {/* top part */}
      <div className="flex flex-col gap-6 max-w-6xl p-20 px-3 mx-auto">
        <h1 className="text-4xl font-bold  lg:text-5xl text-slate-600">
          Find your dream home{" "}
          <span className="text-slate-400 text-4xl font-bold lg:text-5xl">
            today!
          </span>{" "}
          <br />
          place with ease
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          🔍 Search by Location, Price, or Amenities <br />
          🏡 Homes, Apartments, Land & Commercial Properties <br />
          📞 Expert Agents Ready to Help
        </p>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          let's get started...
        </Link>
      </div>

      {/*the swiper part  */}
      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide key={listing._id}>
              <img
                src={listing.imageUrls[0]}
                alt="lisiting"
                className="w-full h-[400px] object-cover"
              />
            </SwiperSlide>
          ))}
      </Swiper>

      {/* rent and sale part */}
      <div className="max-w-6xl mx-auto flex flex-col my-8 p-3 gap-8">
        {offerListing && offerListing.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent Offer
              </h2>
              <Link
                className="text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                {" "}
                show more
              </Link>
            </div>
            <div className="flex flex-wrap gap-4  items-center">
              {offerListing.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent places for Rent
              </h2>
              <Link
                className="text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                show more
              </Link>
            </div>
            <div className="flex flex-wrap gap-4  items-center">
              {rentListing.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent places for Sale
              </h2>
              <Link
                className="text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                {" "}
                show more
              </Link>
            </div>
            <div className="flex flex-wrap gap-4  items-center">
              {saleListing.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      <footer className="bg-gray-300 py-4 mt-10 flex flex-col gap-7">
        <div className="flex justify-between items-center max-w-6xl mx-auto px-3">
          <p className="max-w-md text-sm text-gray-600">
            <span className="font-semibold text-lg text-slate-700">
              Mission
            </span>
            <br></br>Empower individuals to find their perfect property by
            offering reliable listings, intuitive tools, and personalized
            support every step.
          </p>
          <p className="max-w-md text-sm text-gray-600">
            <span className="font-semibold text-lg text-slate-700">vision</span>
            <br></br>To become the leading real estate platform, making property
            discovery and transactions effortless, transparent, and accessible
            to eve
          </p>
          <p className="max-w-md text-sm text-gray-600">
            <span className="font-semibold text-lg text-slate-700">
              team members
            </span>
            <br></br>luxiary realEstate is a team of dedicated professionals
            with a passion for real estate. Our team consists of experienced
            agents,and skilled software developers who are studing at astu!
          </p>
          <p className=" max-w-md text-sm text-gray-600">
            <span className="font-semibold text-lg text-slate-700">
              Contact
            </span>
            <br></br>luxiary realEstate, 123 Main St, City, State, Zip
            <br></br>Phone: (123) 456-7890
            <br></br>Email: mame25351@gmail.com
          </p>
        </div>
        <div className="flex justify-center md:gap-6 gap-4 text-3xl text-gray-600">
          <a
            href="https://t.me/abuzerj"
            target="@_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram className="hover:text-blue-500" />
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="hover:text-pink-500" />
          </a>
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="hover:text-blue-700" />
          </a>
          <a
            href="https://youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube className="hover:text-red-600" />
          </a>
        </div>

        <p className="text-sm text-center text-gray-700">
          &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
