import React from "react";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="shadow-2xl   ">
      <div className=" p-3   flex justify-center items-center">
        <div className=" flex items-center relative">
          <FaSearch className="text-gray-500 left-2 absolute" />
          <input
            type="search"
            placeholder="Search..."
            className="bg-gray-200 border-2 px-7 py-1 w-[450px] outline-none border-gray-300 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
