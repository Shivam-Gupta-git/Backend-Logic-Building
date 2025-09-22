import { createContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ChannelContext = createContext();

const ChannelContextProvider = (props) => {
  const [openSidebox, setSideBox] = useState(false);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const backendURl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  console.log("Token:", token);
  console.log("Backend URL:", backendURl);

  const toggleSideBox = () => setSideBox((prev) => !prev);
  const closeSideBox = () => setSideBox(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  // Fetch user data when token changes
  const fetchUserData = async () => {
    if (!token) {
      console.log("No token, setting userData to null");
      setUserData(null);
      return;
    }
    try {
      const response = await axios.get(`${backendURl}/api/user/currentUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setUserData(response.data.user);
      } else {
        console.log("Response not successful:", response.data.message);
        setUserData(null);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUserData(null);
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
  };

  return (
    <ChannelContext.Provider value={value}>
      {props.children}
    </ChannelContext.Provider>
  );
};

export default ChannelContextProvider;
