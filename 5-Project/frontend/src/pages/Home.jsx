import React, { useContext, useEffect, useState } from "react";
import { ChannelContext } from "../context/ChannelContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlay, FaEye, FaClock, FaExclamationTriangle, FaRedo } from "react-icons/fa";
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
    <div className="w-full h-full min-h-[140px] flex items-center justify-center bg-zinc-800">
      <FaPlay className="text-amber-400/60 text-3xl" />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-zinc-800/60 animate-pulse">
      <div className="aspect-video bg-zinc-700/80" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-zinc-700/80 rounded w-3/4" />
        <div className="h-3 bg-zinc-700/60 rounded w-full" />
        <div className="h-3 bg-zinc-700/60 rounded w-1/2" />
        <div className="flex gap-4 mt-2">
          <div className="h-3 bg-zinc-700/60 rounded w-16" />
          <div className="h-3 bg-zinc-700/60 rounded w-12" />
        </div>
      </div>
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
          "Cannot connect to backend. Run the server in the backend folder: node app.js (port 3000)"
        );
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

  const publishedVideos = videos.filter((v) => v && v.isPublished !== false);

  const formatDuration = (sec) => {
    if (!sec || sec <= 0) return null;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 ">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 w-48 bg-zinc-800/60 rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}


      <div className="max-w-7xl mx-auto px-4 py-8">
        {publishedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {publishedVideos.map((item) => (
              <article
                key={item._id}
                onClick={() => handleVideoClick(item._id)}
                className="group cursor-pointer"
              >
                <div className="relative rounded-xl overflow-hidden bg-zinc-900 ring-1 ring-zinc-800/80 hover:ring-amber-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5">
                  <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                    <VideoThumbnail item={item} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full bg-amber-500/90 flex items-center justify-center shadow-lg">
                        <FaPlay className="text-zinc-950 text-lg ml-1" />
                      </div>
                    </div>
                    {item.duration > 0 && (
                      <div className="absolute bottom-2 right-2 bg-zinc-950/90 text-zinc-300 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                        <FaClock className="text-[10px]" />
                        {formatDuration(item.duration)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white line-clamp-2 group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-400 line-clamp-2 mt-1">
                      {item.description || "No description"}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <FaEye className="text-zinc-600" />
                        {item.views || 0} views
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <FaExclamationTriangle className="text-red-400 text-2xl" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Connection failed</h2>
            <p className="text-zinc-400 max-w-md mb-6">{fetchError}</p>
            <button
              onClick={() => {
                setLoading(true);
                setRetryCount((c) => c + 1);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg transition-colors"
            >
              <FaRedo />
              Retry
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-20 h-20 rounded-full bg-zinc-800/80 flex items-center justify-center mb-6">
              <FaPlay className="text-zinc-500 text-3xl" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No videos yet</h2>
            <p className="text-zinc-400 mb-6">Be the first to upload and share</p>
            {token && (
              <button
                onClick={() => navigate("/UploadVideos")}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg transition-colors"
              >
                Upload video
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
