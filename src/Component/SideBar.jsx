import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import "./SideBar.css";

const SideBar = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
  const navigationItems = [
    { name: "Home", icon: "fas fa-home" , path:'/' },
    { name: "My Watchlist", icon: "fa-solid fa-film" ,path:'/WatchList' },
    { name: "New Movie", icon: "fa-solid fa-clock-rotate-left" ,path:'/addNew' },
    { name: "Support", icon: "fa-solid fa-headset"  ,path:'/'},
    { name: "Settings", icon: "fa-solid fa-gear" ,path:'/'},
  ]; 
   const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  return (
    <div className="theApp flex h-screen">
      {/* Sidebar */}
      <div
        className={`sidebar-gradient fixed md:static top-0 left-0 z-50 h-full w-64 text-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-white border-opacity-10">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-wave-square text-white"></i>
            </div>
            <span className="font-semibold text-white">Gestion Film</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          {navigationItems.map((item) => (
            <Link
              to={`${item.path}`}
              key={item.name}
              className={`nav-item flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer mb-2 ${
                activeItem === item.name ? "bg-white bg-opacity-10" : ""
              }`}
              onClick={() => handleItemClick(item.name)}
            >
              <div className="flex items-center">
                <i className={`${item.icon} w-5 text-center mr-3`}></i>
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-white border-opacity-10">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden mr-3">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <i className="fas fa-user text-white"></i>
              </div>
            </div>
            <div>
              <p className="font-semibold">Youssef</p>
              <p className="text-sm text-white text-opacity-70">
                Youssef@contact.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto"  style={{backgroundColor :"#000"}}>
        {/* Header */}
        <div className="searchBarDiv shadow-sm px-6 py-4 ">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center " style={{width :'100%'}}>
              <button
                className="p-2 rounded-md hover:bg-gray-100 mr-4 md:hidden"
                onClick={toggleSidebar}
              >
                <i className="fas fa-bars text-gray-600"></i>
              </button>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search"
                  className="searchInput pl-10 pr-4 py-2 border border-raduis-20 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full">
                <i className="fas fa-bell text-white-600"  style={{color: 'white', fontSize: '20px', position: 'relative', top: '2px'}}></i>
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <i className="fas fa-user text-white text-sm"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
