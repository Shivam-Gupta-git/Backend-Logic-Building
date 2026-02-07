import React, { useContext, useEffect, useState } from "react";
import { ChannelContext } from "../context/ChannelContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlay, FaEye, FaHeart } from "react-icons/fa";
import { API_BASE } from "../lib/api.js";


function VideoThumbnail({ item }) {
  const rawThumb = item?.thumbnail ?? item?.thumb ?? "";
  const thumbnailUrl = typeof rawThumb === "string" ? rawThumb.trim() : "";
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = thumbnailUrl.length > 0 && !imgFailed;

  if (showImg) {
    return (
      <img
        src={thumbnailUrl}
        alt={item?.title || "Video"}
        className="w-full h-full object-cover block min-h-[140px]"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
      />
    );
  }
  if (item?.videoFile) {
    return (
      <video
        src={item.videoFile}
        className="w-full h-full object-cover block min-h-[140px]"
        muted
        preload="metadata"
      />
    );
  }
  return (
    <div className="w-full h-full min-h-[140px] flex items-center justify-center bg-gray-800">
      <FaPlay className="text-white text-4xl" />
    </div>
  );
}

function Home() {
  const { token } = useContext(ChannelContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = 15000;

    const fetchVideos = async () => {
      setFetchError(null);
      try {
        const response = await axios.get(`${API_BASE}/api/user/videos`, {
          signal: controller.signal,
          timeout,
        });
        if (response.data.success && Array.isArray(response.data.data)) {
          setVideos(response.data.data);
        }
      } catch (error) {
        if (
          axios.isCancel(error) ||
          error.name === "AbortError" ||
          error.code === "ECONNABORTED"
        ) {
          return;
        }
        setFetchError(
          "Cannot connect to backend. Start the server: in the backend folder run 'npm run dev' or 'node app.js'. Server must run on http://localhost:3000"
        );
        console.error("Failed to fetch videos:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
    return () => controller.abort();
  }, [retryCount]);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Trending Videos
        </h1>

        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos
              .filter((v) => v && v.isPublished !== false)
              .map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleVideoClick(item._id)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="relative aspect-video bg-gray-900 overflow-hidden">
                    <VideoThumbnail item={item} />
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
        ) : fetchError ? (
          <div className="text-center py-20 bg-white rounded-lg border border-red-200 p-8">
            <p className="text-red-600 font-medium mb-2">
              Could not load videos
            </p>
            <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
              {fetchError}
            </p>
            <button
              onClick={() => {
                setLoading(true);
                setRetryCount((c) => c + 1);
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No videos available</p>
            {token && (
              <button
                onClick={() => navigate("/UploadVideos")}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Upload Your First Video
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
