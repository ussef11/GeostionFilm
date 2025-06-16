import React, { useEffect, useState, useMemo } from "react";
import "./WatchList.css";
const WatchList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchlistIds, setWatchlistIds] = useState([]);

  const API_KEY = "e84400a64891de7d586509287fb9fcaa";
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const loadWatchlist = () => {
      const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      setWatchlistIds(watchlist);
      return watchlist;
    };

    const fetchMovieDetails = async (movieId) => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
        );
        if (!response.ok) throw new Error(`Failed to fetch movie ${movieId}`);
        return await response.json();
      } catch (error) {
        console.error(`Error fetching movie ${movieId}:`, error);
        return null;
      }
    };

    const fetchAllMovies = async () => {
      setLoading(true);
      setError(null);

      const ids = loadWatchlist();

      if (ids.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        const moviePromises = ids.map((id) => fetchMovieDetails(id));
        const movieResults = await Promise.all(moviePromises);
        const validMovies = movieResults.filter((movie) => movie !== null);
        setMovies(validMovies);
      } catch (err) {
        setError("Failed to load watchlist movies");
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  const removeFromWatchlist = (movieId) => {
    const updatedIds = watchlistIds.filter((id) => id !== movieId);
    setWatchlistIds(updatedIds);
    localStorage.setItem("watchlist", JSON.stringify(updatedIds));
    setMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== movieId)
    );
  };

  const clearWatchlist = () => {
    setWatchlistIds([]);
    setMovies([]);
    localStorage.removeItem("watchlist");
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getGenreNames = (genres) => {
    return genres?.map((genre) => genre.name).join(", ") || "Unknown";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl text-center">
          <i className="fas fa-spinner fa-spin mr-2 text-3xl mb-4"></i>
          <div>Loading your watchlist...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              <i className="fas fa-bookmark mr-4"></i>
              My Watchlist
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              {movies.length === 0
                ? "Your watchlist is empty"
                : `${movies.length} movie${
                    movies.length !== 1 ? "s" : ""
                  } saved for later`}
            </p>
            {movies.length > 0 && (
              <button
                onClick={clearWatchlist}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md font-semibold transition-colors"
              >
                <i className="fas fa-trash mr-2"></i>
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {movies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-500 mb-8">
              <i className="fas fa-film text-6xl mb-4"></i>
              <h2 className="text-2xl font-bold mb-2">
                No movies in your watchlist
              </h2>
              <p className="text-lg">
                Start adding movies to build your collection!
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="movie-card bg-gray-900 rounded-lg overflow-hidden"
              >
                {/* Movie Poster */}
                <div className="relative aspect-[2/3]">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750/1f2937/9ca3af?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 text-center">
                      <button
                        onClick={() => removeFromWatchlist(movie.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md mb-2 transition-colors"
                      >
                        <i className="fas fa-trash mr-2"></i>
                        Remove
                      </button>
                    </div>
                  </div>
                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-yellow-400 px-2 py-1 rounded-md text-sm font-bold">
                    <i className="fas fa-star mr-1"></i>
                    {movie.vote_average.toFixed(1)}
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">
                    {movie.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                    <span>•</span>
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>

                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {getGenreNames(movie.genres)}
                  </p>

                  <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                    {movie.overview || "No description available"}
                  </p>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => window.open(`/film/${movie.id}`, "_blank")}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center"
                    >
                      <i className="fas fa-play mr-2"></i>
                      Watch
                    </button>
                    <button
                      onClick={() => removeFromWatchlist(movie.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove from watchlist"
                    >
                      <i className="fas fa-bookmark text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      {movies.length > 0 && (
        <div className="bg-gray-900 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Watchlist Stats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">
                  {movies.length}
                </div>
                <div className="text-gray-400">Total Movies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">
                  {movies.reduce((sum, movie) => sum + movie.runtime, 0)} min
                </div>
                <div className="text-gray-400">Total Runtime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {(
                    movies.reduce((sum, movie) => sum + movie.vote_average, 0) /
                    movies.length
                  ).toFixed(1)}
                </div>
                <div className="text-gray-400">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {
                    new Set(
                      movies.flatMap((movie) => movie.genres.map((g) => g.name))
                    ).size
                  }
                </div>
                <div className="text-gray-400">Genres</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default WatchList;
