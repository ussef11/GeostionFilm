/* eslint-disable no-unused-vars */
import React, { useState , useEffect, useRef } from "react";
import './NewMovie'
const NewMovie = () => {
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    release_date: "",
    genres: "",
    poster_path: "",
    backdrop_path: "",
    runtime: "",
    vote_average: "",
    production_companies: "",
    budget: "",
    revenue: "",
    director: "",
    cast: "",
  });

  const [errors, setErrors] = useState({});
  const [customMovies, setCustomMovies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [previewMovie, setPreviewMovie] = useState(null);

  const formRef = useRef(null);
  const API_KEY = "e84400a64891de7d586509287fb9fcaa";
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    loadCustomMovies();
  }, []);

  const loadCustomMovies = () => {
    const stored = localStorage.getItem("customMovies");
    if (stored) {
      setCustomMovies(JSON.parse(stored));
    }
  };

  const generateCustomId = () => {
    return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.overview.trim()) {
      newErrors.overview = "Overview is required";
    }

    if (!formData.release_date) {
      newErrors.release_date = "Release date is required";
    }

    if (!formData.genres.trim()) {
      newErrors.genres = "At least one genre is required";
    }

    if (
      formData.vote_average &&
      (isNaN(formData.vote_average) ||
        formData.vote_average < 0 ||
        formData.vote_average > 10)
    ) {
      newErrors.vote_average = "Rating must be between 0 and 10";
    }

    if (formData.runtime && (isNaN(formData.runtime) || formData.runtime < 0)) {
      newErrors.runtime = "Runtime must be a positive number";
    }

    if (formData.poster_path && !isValidUrl(formData.poster_path)) {
      newErrors.poster_path = "Please enter a valid URL";
    }

    if (formData.backdrop_path && !isValidUrl(formData.backdrop_path)) {
      newErrors.backdrop_path = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const searchMovies = async (query) => {
    if (!query.trim()) return;
 console.log('query', query)
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

  const fillFromTMDB = async (movie) => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
      );

      if (response.ok) {
        const movieData = await response.json();
        const credits = movieData.credits;

        setFormData({
          title: movieData.title || "",
          overview: movieData.overview || "",
          release_date: movieData.release_date || "",
          genres: movieData.genres.map((g) => g.name).join(", ") || "",
          poster_path: movieData.poster_path
            ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
            : "",
          backdrop_path: movieData.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
            : "",
          runtime: movieData.runtime?.toString() || "",
          vote_average: movieData.vote_average?.toString() || "",
          production_companies:
            movieData.production_companies.map((c) => c.name).join(", ") || "",
          budget: movieData.budget?.toString() || "",
          revenue: movieData.revenue?.toString() || "",
          director:
            credits?.crew
              ?.filter((c) => c.job === "Director")
              .map((d) => d.name)
              .join(", ") || "",
          cast:
            credits?.cast
              ?.slice(0, 5)
              .map((c) => c.name)
              .join(", ") || "",
        });

        setShowSearch(false);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newMovie = {
        id: generateCustomId(),
        ...formData,
        genres: formData.genres.split(",").map((g) => ({ name: g.trim() })),
        production_companies: formData.production_companies
          .split(",")
          .map((c) => ({ name: c.trim() })),
        runtime: parseInt(formData.runtime) || 0,
        vote_average: parseFloat(formData.vote_average) || 0,
        budget: parseInt(formData.budget) || 0,
        revenue: parseInt(formData.revenue) || 0,
        vote_count: 0,
        isCustom: true,
        created_at: new Date().toISOString(),
      };

      const updatedMovies = [...customMovies, newMovie];
      localStorage.setItem("customMovies", JSON.stringify(updatedMovies));
      setCustomMovies(updatedMovies);

      setFormData({
        title: "",
        overview: "",
        release_date: "",
        genres: "",
        poster_path: "",
        backdrop_path: "",
        runtime: "",
        vote_average: "",
        production_companies: "",
        budget: "",
        revenue: "",
        director: "",
        cast: "",
      });

      setSuccessMessage("Movie added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsSubmitting(false);

      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  };

  const addToWatchlist = (movieId) => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (!watchlist.includes(movieId)) {
      const updatedWatchlist = [...watchlist, movieId];
      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      alert("Added to watchlist!");
    } else {
      alert("Already in watchlist!");
    }
  };

  const deleteCustomMovie = (movieId) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      const updatedMovies = customMovies.filter(
        (movie) => movie.id !== movieId
      );
      localStorage.setItem("customMovies", JSON.stringify(updatedMovies));
      setCustomMovies(updatedMovies);

      // Also remove from watchlist if present
      const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      const updatedWatchlist = watchlist.filter((id) => id !== movieId);
      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            <i className="fas fa-plus-circle mr-4"></i>
            Add Custom Movie
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Create your own movie entries and add them to your personal
            collection. Fill out the form below or search TMDB to auto-fill
            data.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 p-4 bg-green-600 bg-opacity-20 border border-green-600 rounded-lg text-green-400 text-center fade-in">
            <i className="fas fa-check-circle mr-2"></i>
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl p-8 form-glow">
              {/* TMDB Search */}
              <div className="mb-8">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
                >
                  <i className="fas fa-search mr-2"></i>
                  {showSearch ? "Hide TMDB Search" : "Search TMDB to Auto-Fill"}
                </button>

                {showSearch && (
                  <div className="mt-4 fade-in">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search for a movie on TMDB..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 input-focus"
                        onChange={(e) => searchMovies(e.target.value)}
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

                    {searchResults.length > 0 && (
                      <div className="mt-2 bg-gray-800 rounded-lg border border-gray-700 max-h-60 overflow-y-auto custom-scrollbar">
                        {searchResults.map((movie) => (
                          <div
                            key={movie.id}
                            onClick={() => fillFromTMDB(movie)}
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
                )}
              </div>

              {/* Form */}
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-film mr-2 text-red-500"></i>
                      Movie Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-800 border ${
                        errors.title ? "border-red-500" : "border-gray-700"
                      } rounded-lg px-4 py-3 text-white placeholder-gray-400 input-focus`}
                      placeholder="Enter movie title"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-calendar mr-2 text-red-500"></i>
                      Release Date *
                    </label>
                    <input
                      type="date"
                      name="release_date"
                      value={formData.release_date}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-800 border ${
                        errors.release_date
                          ? "border-red-500"
                          : "border-gray-700"
                      } rounded-lg px-4 py-3 text-white input-focus`}
                    />
                    {errors.release_date && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.release_date}
                      </p>
                    )}
                  </div>
                </div>

                {/* Overview */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <i className="fas fa-align-left mr-2 text-red-500"></i>
                    Overview *
                  </label>
                  <textarea
                    name="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full bg-gray-800 border ${
                      errors.overview ? "border-red-500" : "border-gray-700"
                    } rounded-lg px-4 py-3 text-white placeholder-gray-400 input-focus resize-none`}
                    placeholder="Enter movie description"
                  ></textarea>
                  {errors.overview && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.overview}
                    </p>
                  )}
                </div>

                {/* Genres and Rating */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-tags mr-2 text-red-500"></i>
                      Genres * (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="genres"
                      value={formData.genres}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-800 border ${
                        errors.genres ? "border-red-500" : "border-gray-700"
                      } rounded-lg px-4 py-3 text-white placeholder-gray-400 input-focus`}
                      placeholder="Action, Drama, Thriller"
                    />
                    {errors.genres && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.genres}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-star mr-2 text-red-500"></i>
                      Rating (0-10)
                    </label>
                    <input
                      type="number"
                      name="vote_average"
                      value={formData.vote_average}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.1"
                      className={`w-full bg-gray-800 border ${
                        errors.vote_average
                          ? "border-red-500"
                          : "border-gray-700"
                      } rounded-lg px-4 py-3 text-white input-focus`}
                      placeholder="7.5"
                    />
                    {errors.vote_average && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.vote_average}
                      </p>
                    )}
                  </div>
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-image mr-2 text-red-500"></i>
                      Poster URL
                    </label>
                    <input
                      type="url"
                      name="poster_path"
                      value={formData.poster_path}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-800 border ${
                        errors.poster_path
                          ? "border-red-500"
                          : "border-gray-700"
                      } rounded-lg px-4 py-3 text-white placeholder-gray-400 input-focus`}
                      placeholder="https://example.com/poster.jpg"
                    />
                    {errors.poster_path && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.poster_path}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-panorama mr-2 text-red-500"></i>
                      Backdrop URL
                    </label>
                    <input
                      type="url"
                      name="backdrop_path"
                      value={formData.backdrop_path}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-800 border ${
                        errors.backdrop_path
                          ? "border-red-500"
                          : "border-gray-700"
                      } rounded-lg px-4 py-3 text-white placeholder-gray-400 input-focus`}
                      placeholder="https://example.com/backdrop.jpg"
                    />
                    {errors.backdrop_path && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.backdrop_path}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-clock mr-2 text-red-500"></i>
                      Runtime (minutes)
                    </label>
                    <input
                      type="number"
                      name="runtime"
                      value={formData.runtime}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full bg-gray-800 border ${
                        errors.runtime ? "border-red-500" : "border-gray-700"
                      } rounded-lg px-4 py-3 text-white input-focus`}
                      placeholder="120"
                    />
                    {errors.runtime && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.runtime}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-building mr-2 text-red-500"></i>
                      Production Companies
                    </label>
                    <input
                      type="text"
                      name="production_companies"
                      value={formData.production_companies}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 input-focus"
                      placeholder="Warner Bros, Universal"
                    />
                  </div>
                </div>

                {/* Budget and Revenue */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-dollar-sign mr-2 text-red-500"></i>
                      Budget ($)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white input-focus"
                      placeholder="50000000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-chart-line mr-2 text-red-500"></i>
                      Revenue ($)
                    </label>
                    <input
                      type="number"
                      name="revenue"
                      value={formData.revenue}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white input-focus"
                      placeholder="150000000"
                    />
                  </div>
                </div>

                {/* Cast and Crew */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-user-tie mr-2 text-red-500"></i>
                      Director
                    </label>
                    <input
                      type="text"
                      name="director"
                      value={formData.director}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 input-focus"
                      placeholder="Christopher Nolan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-users mr-2 text-red-500"></i>
                      Main Cast (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="cast"
                      value={formData.cast}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 input-focus"
                      placeholder="Actor 1, Actor 2, Actor 3"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${
                      isSubmitting
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center text-lg`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="flex space-x-1 mr-3">
                          <div className="w-2 h-2 bg-white rounded-full loading-dots"></div>
                          <div className="w-2 h-2 bg-white rounded-full loading-dots"></div>
                          <div className="w-2 h-2 bg-white rounded-full loading-dots"></div>
                        </div>
                        Adding Movie...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus mr-2"></i>
                        Add Movie
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-4 text-center">
                <i className="fas fa-eye mr-2 text-red-500"></i>
                Preview
              </h3>

              {formData.title ? (
                <div className="space-y-4">
                  {formData.poster_path && (
                    <div className="aspect-w-2 aspect-h-3">
                      <img
                        src={formData.poster_path}
                        alt={formData.title}
                        className="w-full h-64 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x450/1f2937/9ca3af?text=No+Image";
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {formData.title}
                    </h4>
                    {formData.vote_average && (
                      <div className="flex items-center mb-2">
                        <i className="fas fa-star text-yellow-400 mr-1"></i>
                        <span className="text-sm">{formData.vote_average}</span>
                      </div>
                    )}
                    {formData.genres && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {formData.genres
                          .split(",")
                          .slice(0, 3)
                          .map((genre, index) => (
                            <span
                              key={index}
                              className="genre-tag text-xs px-2 py-1 rounded-full text-white"
                            >
                              {genre.trim()}
                            </span>
                          ))}
                      </div>
                    )}
                    {formData.overview && (
                      <p className="text-gray-400 text-sm line-clamp-4">
                        {formData.overview}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <i className="fas fa-film text-4xl mb-4"></i>
                  <p>Fill out the form to see a preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Movies List */}
        {customMovies.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                <i className="fas fa-list mr-3 text-red-500"></i>
                Your Custom Movies ({customMovies.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {customMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-900 rounded-lg overflow-hidden movie-card-hover fade-in"
                >
                  <div className="relative aspect-w-2 aspect-h-3">
                    <img
                      src={
                        movie.poster_path ||
                        "https://via.placeholder.com/300x450/1f2937/9ca3af?text=No+Image"
                      }
                      alt={movie.title}
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x450/1f2937/9ca3af?text=No+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => addToWatchlist(movie.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
                          title="Add to Watchlist"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                        <button
                          onClick={() => deleteCustomMovie(movie.id)}
                          className="bg-red-800 hover:bg-red-900 text-white p-3 rounded-full transition-colors"
                          title="Delete Movie"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 truncate">
                      {movie.title}
                    </h3>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">
                        {new Date(movie.release_date).getFullYear() ||
                          "Unknown"}
                      </span>
                      {movie.vote_average > 0 && (
                        <div className="flex items-center">
                          <i className="fas fa-star text-yellow-400 mr-1"></i>
                          <span className="text-sm text-white">
                            {movie.vote_average}
                          </span>
                        </div>
                      )}
                    </div>

                    {movie.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {movie.genres.slice(0, 2).map((genre, index) => (
                          <span
                            key={index}
                            className="bg-red-600 text-xs px-2 py-1 rounded-full text-white"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-gray-400 text-sm line-clamp-3">
                      {movie.overview}
                    </p>

                    {(movie.runtime > 0 || movie.director) && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        {movie.runtime > 0 && (
                          <p className="text-xs text-gray-500">
                            <i className="fas fa-clock mr-1"></i>
                            {formatRuntime(movie.runtime)}
                          </p>
                        )}
                        {movie.director && (
                          <p className="text-xs text-gray-500 truncate">
                            <i className="fas fa-user-tie mr-1"></i>
                            {movie.director}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-600">
                      <i className="fas fa-plus-circle mr-1"></i>
                      Added: {new Date(movie.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for Custom Movies */}
        {customMovies.length === 0 && (
          <div className="mt-16 text-center py-12">
            <i className="fas fa-film text-6xl text-gray-600 mb-4"></i>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              No Custom Movies Yet
            </h3>
            <p className="text-gray-500">
              Start by adding your first custom movie using the form above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default NewMovie;
