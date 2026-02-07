import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChannelContext } from "../context/ChannelContext";
import axios from "axios";
import { FaPlay, FaEye, FaHeart, FaSearch } from "react-icons/fa";
import { API_BASE } from "../lib/api.js";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useContext(ChannelContext);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allVideos, setAllVideos] = useState([]);
  const query = searchParams.get("q") || "";

  useEffect(() => {
    let cancelled = false;
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/user/videos`, {
          timeout: 15000,
        });
        if (
          !cancelled &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          setAllVideos(response.data.data);
        }
      } catch (_err) {
        if (!cancelled) setAllVideos([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    setLoading(true);
    fetchVideos();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase().trim();
    const filtered = allVideos.filter((v) => {
      if (!v) return false;
      const title = (v.title || "").toLowerCase();
      const description = (v.description || "").toLowerCase();
      return (
        (title.includes(lowerQuery) || description.includes(lowerQuery)) &&
        v.isPublished !== false
      );
    });
    setSearchResults(filtered);
  }, [query, allVideos]);

  const handleVideoClick = (videoId) => {
    if (token) {
      navigate(`/video/${videoId}`);
    } else {
      navigate("/Login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-800 flex items-center gap-3">
            <FaSearch className="text-blue-500" /> Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              Found {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""} for "{query}"
            </p>
          )}
        </div>

        {query ? (
          searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleVideoClick(item._id)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="relative aspect-video bg-gray-900">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <FaPlay className="text-white text-4xl" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <FaPlay className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {item.duration > 0 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(item.duration / 60)}:
                        {(item.duration % 60).toString().padStart(2, "0")}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <FaEye className="text-gray-400" />
                        <span>{item.views || 0} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaHeart className="text-gray-400" />
                        <span>Likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg">
              <FaSearch className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No videos found</p>
              <p className="text-gray-400 text-sm mb-4">
                Try searching with different keywords
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Browse All Videos
              </button>
            </div>
          )
        ) : (
          <div className="text-center py-20 bg-white rounded-lg">
            <FaSearch className="text-gray-300 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Enter a search query</p>
            <p className="text-gray-400 text-sm">
              Use the search bar above to find videos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
