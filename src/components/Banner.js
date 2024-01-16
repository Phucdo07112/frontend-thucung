import React from "react";

const Banner = ({ title, link }) => {
  return (
    <div className="relative">
      <img className="w-full" src="../images/image-card.png" alt="" />
      <div className="absolute left-[50%] top-[50%] -translate-x-6 -translate-y-6 text-white">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p>{link}</p>
      </div>
    </div>
  );
};

export default Banner;
