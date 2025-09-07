import { Route, Routes } from "react-router-dom";
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
import { useContext } from "react";
import { ChannelContext } from "./context/ChannelContext";

function App() {
  const { openSidebox } = useContext(ChannelContext);

  return (
    <>
      <Header></Header>
      <div
        className={`${
          openSidebox ? "ml-[20%]" : "ml-[5%]"
        } p-4`}
      >
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route
            path="/Subscriptions"
            element={<Subscriptions></Subscriptions>}
          ></Route>
          <Route
            path="/UserProfile"
            element={<UserProfile></UserProfile>}
          ></Route>
          <Route path="/History" element={<History></History>}></Route>
          <Route path="/Playlist" element={<Playlist></Playlist>}></Route>
          <Route path="/YourVideos" element={<YourVideos></YourVideos>}></Route>
          <Route
            path="/YourChannel"
            element={<YourChannel></YourChannel>}
          ></Route>
          <Route
            path="/LikedVideos"
            element={<LikedVideos></LikedVideos>}
          ></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
