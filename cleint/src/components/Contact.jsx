import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";

export default function Contact({ listing }) {
  const { currentUser } = useSelector((state) => state.user);
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");
  // const [error ,setError] =useState(null);
  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setLandLord(data);
      } catch (error) {
        console.log("Error fetching landlord:", error);
      }
    };
    fetchLandLord();
  }, [listing.userRef]);
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  console.log("fetched listing userRef:" + listing?.userRef);
  return (
    <>
      {landLord && (
        <div className="max-w-2xl mx-auto">
          <p>
            Contact : <span className="font-semibold">{landLord.username}</span>
            for
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          ></textarea>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${
              landLord?.email
            }&su=${encodeURIComponent(
              `Regarding ${listing?.name}`
            )}&body=${encodeURIComponent(
              message + " You can reach me at: " + currentUser?.email
            )}`}
            className="block bg-gray-700 w-full mt-3 rounded p-3 cursor-pointer text-center text-white uppercase hover:opacity-80 transition"
            target="_blank" // Opens in a new tab
            rel="noopener noreferrer"
          >
            Send a message (via Gmail)
          </a>
        </div>
      )}
    </>
  );
}
