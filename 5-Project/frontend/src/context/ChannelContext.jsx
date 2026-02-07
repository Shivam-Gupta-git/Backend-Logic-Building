import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../lib/api.js";

export const ChannelContext = createContext();

const ChannelContextProvider = (props) => {
  const [openSidebox, setSideBox] = useState(false);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const [video, setVideo] = useState([]);
  const backendURl = API_BASE;

  const toggleSideBox = () => setSideBox((prev) => !prev);
  const closeSideBox = () => setSideBox(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const fetchUserData = async () => {
    if (!token) {
      setUserData(null);
      return;
    }
    try {
      const response = await axios.get(`${backendURl}/api/user/currentUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) setUserData(response.data.user);
      else setUserData(null);
    } catch (error) {
      setUserData(null);
    }
  };

  const refreshVideos = async () => {
    try {
      const response = await axios.get(`${backendURl}/api/user/videos`, {
        timeout: 15000,
      });
      if (response.data.success) setVideo(response.data.data || []);
    } catch (_err) {
      setVideo([]);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  const value = {
    openSidebox,
    toggleSideBox,
    closeSideBox,
    navigate,
    backendURl,
    token,
    setToken,
    userData,
    video,
    refreshVideos,
  };

  return (
    <ChannelContext.Provider value={value}>
      {props.children}
    </ChannelContext.Provider>
  );
};

export default ChannelContextProvider;
