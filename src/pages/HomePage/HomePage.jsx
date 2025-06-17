/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./HomePage.css"
import { Link } from "react-router-dom";

const HomePage = () => {
  // Custom hook for API calls
  const useFetch = url => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(url);
          if (!response.ok) throw new Error("Failed to fetch");
          const result = await response.json();
          setData(result.results || result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [url]);

    return { data, loading, error };
  };

  // Movie Card Component
  const MovieCard = ({   movie, size = "normal" }) => {
    const imageSize = size === "large" ? "w500" : "w300";
    const cardSize = size === "large" ? "w-64 h-96" : "w-48 h-72";
 
    return (
      <Link to={`film/${movie.id}`} className={`${cardSize} flex-shrink-0 movie-card cursor-pointer`}>
        <div className="relative h-full rounded-lg overflow-hidden bg-gray-800">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/${imageSize}${movie.poster_path}`
                : "https://via.placeholder.com/300x450/1f2937/9ca3af?text=No+Image"
            }
            alt={movie.title || movie.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <i className="fas fa-play text-white text-3xl opacity-0 hover:opacity-100 transition-opacity duration-300"></i>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
            <h3 className="text-white text-sm font-semibold truncate">
              {movie.title || movie.name}
            </h3>
            <div className="flex items-center mt-1">
              <i className="fas fa-star text-yellow-400 text-xs mr-1"></i>
              <span className="text-gray-300 text-xs">
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // Hero Section Component
  const HeroSection = ({ featuredMovie }) => {
    if (!featuredMovie) return null;

    return (
      <div className="relative h-96 md:h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt={featuredMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {featuredMovie.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 line-clamp-3">
              {featuredMovie.overview}
            </p>
            <div className="flex space-x-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition-colors duration-300 flex items-center">
                <i className="fas fa-play mr-2"></i>
                Continue Watching
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-md font-semibold transition-colors duration-300 flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Movie Row Component
  const MovieRow = ({ title, movies, seeAllUrl, size = "normal" }) => {
    const scrollContainer = React.useRef(null);

    const scroll = direction => {
      if (scrollContainer.current) {
        const scrollAmount = 300;
        scrollContainer.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
          <button className="text-gray-400 hover:text-white transition-colors text-sm">
            See all
          </button>
        </div>
        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <div
            ref={scrollContainer}
            className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 py-2"
          >
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} size={size} />
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    );
  };

  // Movie of the Day Component
  const MovieOfTheDay = ({ movie }) => {
    if (!movie) return null;

    return (
      <div className="mb-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-48 h-72 object-cover rounded-lg mx-auto"
            />
          </div>
          <div className="md:w-2/3 md:pl-6 text-center md:text-left">
            <div className="text-red-500 text-sm font-semibold mb-2 uppercase tracking-wider">
              Movie of the Day
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {movie.title}
            </h2>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              {movie.overview}
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
              <div className="flex items-center">
                <i className="fas fa-star text-yellow-400 mr-1"></i>
                <span className="text-white font-semibold">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <div className="text-gray-400">
                {new Date(movie.release_date).getFullYear()}
              </div>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold transition-colors duration-300 flex items-center mx-auto md:mx-0">
              <i className="fas fa-play mr-2"></i>
              Watch Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  const API_KEY = "e84400a64891de7d586509287fb9fcaa";
  const BASE_URL = "https://api.themoviedb.org/3";

  const { data: popularMovies, loading: popularLoading } = useFetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  );

  const { data: topRatedMovies, loading: topRatedLoading } = useFetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
  );

  const { data: upcomingMovies, loading: upcomingLoading } = useFetch(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
  );

  const { data: trendingMovies, loading: trendingLoading } = useFetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
  );

  const featuredMovie = popularMovies[0];
  const movieOfTheDay = topRatedMovies[0];

  if (popularLoading && topRatedLoading && upcomingLoading && trendingLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      {/* <HeroSection featuredMovie={featuredMovie} /> */}

      {/* Movie of the Day */}
      <MovieOfTheDay movie={movieOfTheDay} />

      {/* Recommended Movies */}
      <MovieRow
        title="Recommended for YOU"
        movies={trendingMovies.slice(0, 10)}
      />

      {/* Popular Movies */}
      <MovieRow title="Popular Movies" movies={popularMovies.slice(1, 11)} />

      {/* Top Rated */}
      <MovieRow title="Top Rated" movies={topRatedMovies.slice(1, 11)} />

      {/* Upcoming Movies */}
      <MovieRow title="Coming Soon" movies={upcomingMovies.slice(0, 10)} />

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Movie Streaming Platform. Powered by The Movie ussef11.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
