// src/components/Layout.jsx
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <div className="theApp flex h-screen">
    <Sidebar />
    <div className="flex-1 p-6 bg-gray-100 overflow-auto">
      {/* This renders the page content */}
      <Outlet />
    </div>
  </div>
);

export default Layout;
        