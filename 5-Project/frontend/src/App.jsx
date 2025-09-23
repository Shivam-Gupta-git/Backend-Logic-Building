import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import History from "./pages/History";
import Playlist from "./pages/Playlist";
import YourVideos from "./pages/YourVideos";
import YourChannel from "./pages/YourChannel";
import LikedVideos from "./pages/LikedVideos";
import Subscriptions from "./pages/Subscriptions";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import UploadVideos from "./pages/UploadVideos";
import { useContext } from "react";
import { ChannelContext } from "./context/ChannelContext";

function App() {
  const { openSidebox } = useContext(ChannelContext);
  const location = useLocation();
  const isLoginPage = location.pathname === "/Login";
  const isVideoUploas = location.pathname === "/UploadVideos"

  return (
    <>
      <div className={isLoginPage || isVideoUploas ? "blur-sm" : ""}>
        <Header isLoginPage={isLoginPage}></Header>
        <div className={`${openSidebox ? "ml-[20%]" : "ml-[5%]"} p-4`}>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/Subscriptions" element={<Subscriptions />}></Route>
            <Route path="/UserProfile" element={<UserProfile />}></Route>
            <Route path="/History" element={<History />}></Route>
            <Route path="/Playlist" element={<Playlist />}></Route>
            <Route path="/YourVideos" element={<YourVideos />}></Route>
            <Route path="/YourChannel" element={<YourChannel />}></Route>
            <Route path="/LikedVideos" element={<LikedVideos />}></Route>
          </Routes>
        </div>
      </div>
      {isLoginPage && <Login />}
      {isVideoUploas && <UploadVideos/>}
      
      
    </>
  );
}

export default App;
