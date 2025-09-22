import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ChannelContext } from "../context/ChannelContext";

// Example 1: Fetch User Data
function UserProfile() {
  const { backendURl, token } = useContext(ChannelContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${backendURl}/api/user/currentUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user.fullName}</p>
      <p>Email: {user.email}</p>
      <p>Username: {user.userName}</p>
      <img src={user.avatar} alt="Avatar" />
    </div>
  );
}

// Example 2: Fetch Watch History
function WatchHistory() {
  const { backendURl, token } = useContext(ChannelContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendURl}/api/user/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  return (
    <div>
      <h2>Watch History</h2>
      {loading ? (
        <div>Loading history...</div>
      ) : (
        <div>
          {history.map((video, index) => (
            <div key={index}>
              <h3>{video.title}</h3>
              <p>{video.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Example 3: Fetch Channel Profile
function ChannelProfile({ userName }) {
  const { backendURl, token } = useContext(ChannelContext);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChannelProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendURl}/api/user/c/${userName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChannel(response.data);
    } catch (error) {
      console.error("Failed to fetch channel:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userName) {
      fetchChannelProfile();
    }
  }, [userName]);

  if (loading) return <div>Loading channel...</div>;
  if (!channel) return <div>Channel not found</div>;

  return (
    <div>
      <h2>{channel.fullName}</h2>
      <p>@{channel.userName}</p>
      <p>Subscribers: {channel.subscribersCount}</p>
      <img src={channel.avatar} alt="Channel Avatar" />
    </div>
  );
}

// Example 4: Custom Hook for Data Fetching
function useUserData() {
  const { backendURl, token } = useContext(ChannelContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${backendURl}/api/user/currentUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  return { user, loading, error, refetch: fetchUser };
}

// Example 5: Using the Custom Hook
function UserDashboard() {
  const { user, loading, error, refetch } = useUserData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <h1>Welcome, {user.fullName}!</h1>
      <button onClick={refetch}>Refresh Data</button>
      <p>Email: {user.email}</p>
    </div>
  );
}

export {
  UserProfile,
  WatchHistory,
  ChannelProfile,
  useUserData,
  UserDashboard,
};
