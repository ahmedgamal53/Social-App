import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <div className="flex relative ">
        <Sidebar />
        <div className="flex-col ml-50 w-full ">
          <Navbar />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
