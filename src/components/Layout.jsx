import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <div className="flex  relative ">
        <Sidebar />
        <div className="flex-col md:ml-50 w-full ">
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
