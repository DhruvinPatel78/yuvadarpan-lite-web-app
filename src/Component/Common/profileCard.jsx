import React from "react";

const ProfileCard = ({
  name,
  location,
  age,
  imgSrc,
  father,
  mother,
  firm,
  surname,
}) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg transition-all duration-300 bg-white hover:shadow-xl cursor-pointer group sm:relative">
      <div className="relative">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-60 sm:h-96 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-300 sm:block hidden" />
        <div className="absolute bottom-2 left-2 sm:bottom-5 sm:left-5 bg-black/60 sm:bg-transparent text-white sm:text-white px-3 py-1 rounded-full text-xs sm:text-base sm:hidden">
          {age} Yrs
        </div>
      </div>
      <div className="px-4 sm:px-0 py-3 sm:py-0 sm:absolute sm:bottom-5 sm:left-5">
        <h2 className="text-lg font-bold text-gray-800 sm:text-white">
          {name} {mother} {father} {surname}
        </h2>
        <p className="text-sm text-gray-500 sm:text-gray-200 flex gap-2 items-center sm:text-white">
          {location}
          <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full mt-1 sm:inline-block hidden">
            {age} Yrs
          </span>
        </p>
        <p className="sm:block hidden sm:text-white">
          <strong>Firm:</strong> {firm}
        </p>
        <p className="sm:hidden">
          <strong>Firm:</strong> {firm}
        </p>
      </div>
    </div>
  );
};
export default ProfileCard;
