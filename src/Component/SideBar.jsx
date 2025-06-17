/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import "./SideBar.css";

const SideBar = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  const divRef = useRef(null);
  const API_KEY = "e84400a64891de7d586509287fb9fcaa";
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    console.log("showSearch", showSearch);
  }, []);
  const triggerHide = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setShowSearch(false);
    }, 300);
  };
  useEffect(() => {
    const handleClick = e => {
      if (divRef.current && !divRef.current.contains(e.target)) {
        console.log("d");
        
        triggerHide();
      }else{
        setShowSearch(true)
        setAnimateOut(true);
      }
    };

    const handleMouseMove = e => {
      if (divRef.current && !divRef.current.contains(e.target)) {
         console.log('🔹 Mouse moved outside the div');
        triggerHide();
      }else{
        setShowSearch(true)
        setAnimateOut(true);
      }
    };

    const handleScroll = e => {
      if (divRef.current && !divRef.current.contains(e.target)) {
        console.log('🔹 Scrolled outside the div (mouse wheel)');
        triggerHide();
      }else{
        setShowSearch(true)
        setAnimateOut(true);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("wheel", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("wheel", handleScroll);
    };
  }, []);

  const navigationItems = [
    { name: "Home", icon: "fas fa-home", path: "/" },
    { name: "My Watchlist", icon: "fa-solid fa-film", path: "/WatchList" },
    {
      name: "New Movie",
      icon: "fa-solid fa-clock-rotate-left",
      path: "/addNew",
    },
    { name: "Support", icon: "fa-solid fa-headset", path: "/" },
    { name: "Settings", icon: "fa-solid fa-gear", path: "/" },
  ];
  const handleItemClick = itemName => {
    setActiveItem(itemName);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  const searchMovies = async query => {
    if (!query.trim()) return;
    setShowSearch(true);
    console.log("query", query);
    setIsSearching(true);
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=1`
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results.slice(0, 5));
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

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
          {navigationItems.map(item => (
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
      <div
        className="flex-1 overflow-y-auto"
        style={{ backgroundColor: "#000" }}
      >
        {/* Header */}
        <div ref={divRef} className="searchBarDiv shadow-sm px-6 py-4 ">
          <div className="flex items-center justify-between w-full">
            {
              <div
                className="mt-4 fade-in"
                style={{ width: "70%" }}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for a movie on TMDB..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 input-focus"
                    onChange={e => searchMovies(e.target.value)}
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full loading-dots"></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full loading-dots"></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full loading-dots"></div>
                      </div>
                    </div>
                  )}
                </div>
                  
                {searchResults.length > 0 && showSearch && (
                  <div
                    className={`animated-box ${
                      animateOut ? "fade-out" : "fade-in"
                    } mt-2 bg-gray-800 rounded-lg border border-gray-700 max-h-60 overflow-y-auto custom-scrollbar`}
                  >
                    {searchResults.map(movie => (
                      <div
                        key={movie.id}
                        //onClick={() => fillFromTMDB(movie)}
                        className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <img
                          src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                              : "https://via.placeholder.com/92x138/1f2937/9ca3af?text=No+Image"
                          }
                          alt={movie.title}
                          className="w-12 h-18 object-cover rounded mr-3"
                        />
                        <div>
                          <h4 className="text-white font-semibold">
                            {movie.title}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {movie.release_date?.split("-")[0] || "Unknown"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            }
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full">
                <i
                  className="fas fa-bell text-white-600"
                  style={{
                    color: "white",
                    fontSize: "20px",
                    position: "relative",
                    top: "2px",
                  }}
                ></i>
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
