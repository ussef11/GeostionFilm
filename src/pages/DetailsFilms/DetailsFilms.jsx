/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./DetailsFilm.css";

const DetailsFilms = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState({
    status: false,
    id: null,
  });

  const API_KEY = "e84400a64891de7d586509287fb9fcaa";
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    console.log("id", id);
  }, [id]);
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);

        // Fetch movie details
        const movieResponse = await fetch(
          `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        console.log(
          "${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US",
          `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        if (!movieResponse.ok) throw new Error("Failed to fetch movie details");
        const movieData = await movieResponse.json();

        // Fetch cast and crew
        const creditsResponse = await fetch(
          `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
        );
        if (!creditsResponse.ok) throw new Error("Failed to fetch credits");
        const creditsData = await creditsResponse.json();

        // Fetch similar movies
        const similarResponse = await fetch(
          `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`
        );
        if (!similarResponse.ok)
          throw new Error("Failed to fetch similar movies");
        const similarData = await similarResponse.json();

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 10));
        setCrew(
          creditsData.crew.filter((member) =>
            ["Director", "Producer", "Writer", "Screenplay"].includes(
              member.job
            )
          )
        );
        setSimilarMovies(similarData.results.slice(0, 6));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleWatchMovie = () => {
    // Implement watch functionality
    console.log("Watching movie:", movie.title);
  };

const handleAddToWatchlist = (id) => {
  const existingList = JSON.parse(localStorage.getItem("watchlist")) || [];

  let updatedList;
  let action;

  if (existingList.includes(id)) {
    updatedList = existingList.filter((itemId) => itemId !== id);
    action = "Removed from";
  } else {
    updatedList = [...existingList, id];
    action = "Added to";
  }

  localStorage.setItem("watchlist", JSON.stringify(updatedList));
  console.log(`${action} watchlist`);

  // Optional: update UI state
  setIsInWatchlist({
    status: updatedList.includes(id),
    id: id,
  });
};

  useEffect(() => {
    console.log("isInWatchlist", isInWatchlist);
  });

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Loading movie details...
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error || "Movie not found"}
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 h-screen">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Movie Poster */}
              <div className="flex-shrink-0">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-80 h-auto rounded-lg shadow-2xl"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1 lg:pl-8">
                {/* Age Rating */}
                <div className="inline-block bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold mb-4">
                  18+
                </div>

                {/* Title */}
                <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                  {movie.title}
                </h1>

                {/* Genres and Year */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center text-gray-300">
                    <span className="text-sm">
                      {movie.genres.map((genre) => genre.name).join(", ")}
                    </span>
                  </div>
                  <div className="text-gray-300">•</div>
                  <div className="text-gray-300">
                    {new Date(movie.release_date).getFullYear()}
                  </div>
                  <div className="text-gray-300">•</div>
                  <div className="text-gray-300">
                    {formatRuntime(movie.runtime)}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <i className="fas fa-star text-yellow-400 mr-2"></i>
                    <span className="text-2xl font-bold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-gray-400 ml-1 text-sm">
                      ({movie.vote_count.toLocaleString()} reviews)
                    </span>
                  </div>
                </div>

                {/* Overview */}
                <p className="text-lg text-gray-300 mb-8 max-w-3xl leading-relaxed">
                  {movie.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <button
                    onClick={handleWatchMovie}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition-colors duration-300 flex items-center"
                  >
                    <i className="fas fa-play mr-2"></i>
                    Watch Movie
                  </button>
                  <button
                    onClick={()=>{handleAddToWatchlist(movie.id)}}
                    className={`${
                      isInWatchlist.status
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    } text-white px-8 py-3 rounded-md font-semibold transition-colors duration-300 flex items-center`}
                  >
                    <i
                      className={`fas ${
                        isInWatchlist.status ? "fa-check" : "fa-plus"
                      } mr-2`}
                    ></i>
                    {isInWatchlist.status ? "In Watchlist" : "Watchlist"}
                  </button>
                </div>

                {/* Movie Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                      Studio
                    </h3>
                    <p className="text-white">
                      {movie.production_companies
                        .map((company) => company.name)
                        .join(", ")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                      Director
                    </h3>
                    <p className="text-white">
                      {crew
                        .filter((member) => member.job === "Director")
                        .map((director) => director.name)
                        .join(", ") || "N/A"}
                    </p>
                  </div>
                  {movie.budget > 0 && (
                    <div>
                      <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                        Budget
                      </h3>
                      <p className="text-white">
                        {formatCurrency(movie.budget)}
                      </p>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div>
                      <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                        Box Office
                      </h3>
                      <p className="text-white">
                        {formatCurrency(movie.revenue)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-800">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <i className="fas fa-user text-2xl"></i>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{actor.name}</h3>
                  <p className="text-gray-400 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Writers Section */}
      {crew.length > 0 && (
        <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Writers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crew.map((member, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-gray-400 text-sm w-20">
                    {member.job}:
                  </span>
                  <span className="text-white ml-2">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">People also watch</h2>
              <button className="text-gray-400 hover:text-white text-sm">
                see all
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {similarMovies.map((similarMovie) => (
                <Link
                  to={`/film/${similarMovie.id}`}
                  key={similarMovie.id}
                  className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
                  onClick={() => navigate(`/movie/${similarMovie.id}`)}
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                    <img
                      src={
                        similarMovie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${similarMovie.poster_path}`
                          : "https://via.placeholder.com/300x450/1f2937/9ca3af?text=No+Image"
                      }
                      alt={similarMovie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <i className="fas fa-play text-white text-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></i>
                    </div>
                  </div>
                  <h3 className="text-white text-sm font-medium truncate">
                    {similarMovie.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors duration-300"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </div>
  );
};

export default DetailsFilms;
