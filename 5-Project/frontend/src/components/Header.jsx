import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { HiMiniBars3 } from "react-icons/hi2";
import { CiCirclePlus } from "react-icons/ci";
import { GoBell } from "react-icons/go";
import { IoAddOutline } from "react-icons/io5";
import { IoCreateOutline } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";
import { MdOutlineFeedback } from "react-icons/md";
import { GoHome } from "react-icons/go";
import { MdHistory } from "react-icons/md";
import { MdPlaylistPlay } from "react-icons/md";
import { LiaVideoSolid } from "react-icons/lia";
import { GrChannel } from "react-icons/gr";
import { SlLike } from "react-icons/sl";
import { MdOutlineSubscriptions } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { ChannelContext } from "../context/ChannelContext";

function Header() {
  const [openAddContentBox, setOpenAddContentBox] = useState(false);
  const [openUserBox, setOpenUserBox] = useState(false);
  const { openSidebox, toggleSideBox, closeSideBox } =
    useContext(ChannelContext);

  const toggleAddContentBox = () => {
    setOpenAddContentBox((pre) => {
      const newState = !pre;
      if (newState) setOpenUserBox(false);
      return newState;
    });
  };
  const toggleUserBox = () => {
    setOpenUserBox((pre) => {
      const newState = !pre;
      if (newState) setOpenAddContentBox(false);
      return newState;
    });
  };

  const sideBoxItems1 = (
    <>
      <NavLink
        to="/"
        onClick={closeSideBox}
        className="text-gray-800 py-3 px-4 shadow-sm shadow-gray-300 hover:bg-gray-200  transition-all duration-300 flex flex-row items-center gap-2 rounded-2xl"
      >
        <GoHome className="text-2xl" />
        Home
      </NavLink>
      <NavLink
        to="/subscriptions"
        onClick={closeSideBox}
        className="text-gray-800 py-3 px-4 shadow-sm shadow-gray-300 hover:bg-gray-200  transition-all duration-300 flex flex-row items-center gap-2 rounded-2xl"
      >
        <MdOutlineSubscriptions className="text-2xl" />
        Subscriptions
      </NavLink>
    </>
  );
  const sideBoxItems2 = (
    <>
      <NavLink
        to="/UserProfile"
        onClick={closeSideBox}
        className="px-4 text-xl hover:bg-gray-200 hover:py-2.5  transition-all duration-300 flex flex-row items-center gap-2 rounded-2xl"
      >
        You
        <FaAngleRight />
      </NavLink>
      <NavLink
        to="/History"
        onClick={closeSideBox}
        className="text-gray-800 py-3 px-4 shadow-sm shadow-gray-300 hover:bg-gray-200  transition-all duration-300 flex flex-row items-center gap-2 rounded-2xl"
      >
        <MdHistory className="text-2xl" />
        History
      </NavLink>
      <NavLink
        to="/Playlist"
        onClick={closeSideBox}
        className="text-gray-800 py-3 px-4 shadow-sm shadow-gray-300 hover:bg-gray-200  transition-all duration-300 flex flex-row items-center gap-2 rounded-2xl"
      >
        <MdPlaylistPlay className="text-2xl" />
        Playlist
      </NavLink>
      <NavLink
        to="/YourVideos"
        onClick={closeSideBox}
        className="text-gray-800 py-3 px-4 shadow-sm shadow-gray-300 hover:bg-gray-200  transition-all duration-300 flex flex-row items-center gap-2 rounded-2xl"
      >
        <LiaVideoSolid className="text-2xl" />
        Your Videos
      </NavLink>
      <NavLink
        to="/YourChannel"
        onClick={closeSideBox}
        className="text-gray-800 py-3 px-4 shadow-sm shadow-gray-300 hover:bg-gray-200  transition-all duration-300 flex flex-row items-center gap-2 rounded-2xl"
      >
        <GrChannel className="text-2xl" />
        Your Channel
      </NavLink>
      <NavLink
        to="/LikedVideos"
        onClick={closeSideBox}
        className="text-gray-800 py-3 px-4 shadow-sm shadow-gray-300 hover:bg-gray-200  transition-all duration-300 flex flex-row items-center gap-2 rounded-2xl"
      >
        <SlLike className="text-2xl" />
        Liked Videos
      </NavLink>
    </>
  );

  const sideBarIcon = (
    <>
      <NavLink
        to="/"
        onClick={closeSideBox}
        className="flex items-center justify-center py-2 hover:bg-gray-200  transition-all duration-300 rounded-full"
      >
        <GoHome className="text-2xl " />
      </NavLink>
      <NavLink
        to="/subscriptions"
        onClick={closeSideBox}
        className="flex items-center justify-center py-2 hover:bg-gray-200  transition-all duration-300 rounded-full"
      >
        <MdOutlineSubscriptions className="text-2xl" />
      </NavLink>
      <NavLink
        to="/History"
        onClick={closeSideBox}
        className="flex items-center justify-center py-2 hover:bg-gray-200  transition-all duration-300 rounded-full"
      >
        <MdHistory className="text-2xl" />
      </NavLink>
      <NavLink
        to="/Playlist"
        onClick={closeSideBox}
        className="flex items-center justify-center py-2 hover:bg-gray-200  transition-all duration-300 rounded-full"
      >
        <MdPlaylistPlay className="text-2xl" />
      </NavLink>
      <NavLink
        to="/YourVideos"
        onClick={closeSideBox}
        className="flex items-center justify-center py-2 hover:bg-gray-200  transition-all duration-300 rounded-full"
      >
        <LiaVideoSolid className="text-2xl" />
      </NavLink>
      <NavLink
        to="/YourChannel"
        onClick={closeSideBox}
        className="flex items-center justify-center py-2 hover:bg-gray-200  transition-all duration-300 rounded-full"
      >
        <GrChannel className="text-2xl" />
      </NavLink>
      <NavLink
        to="/LikedVideos"
        onClick={closeSideBox}
        className="flex items-center justify-center py-2 hover:bg-gray-200  transition-all duration-300 rounded-full"
      >
        <SlLike className="text-2xl" />
      </NavLink>
    </>
  );
  return (
    <div className="h-[60px] w-full  flex flex-row items-center justify-between border border-gray-100 sticky top-0 left-0">
      {/* Bars and Logo */}
      <div className="h-full w-[15%]  flex items-center flex-row justify-around relative">
        <div className="h-full w-20  flex items-center justify-center">
          <HiMiniBars3 className="text-2xl" onClick={toggleSideBox} />
        </div>
        <div className="h-full w-40  flex items-center justify-start text-2xl font-light">
          LOGO
        </div>
      </div>
      {/* Search Input */}
      <div className="h-full w-[50%]  flex flex-row items-center justify-center">
        <input
          type="text"
          placeholder="Search"
          className="w-[70%] h-9 border border-gray-300 outline-0 pl-2 rounded-l-3xl"
        />
        <button className="h-9 w-20 border border-gray-300 rounded-r-3xl bg-gray-100 flex items-center justify-center">
          <CiSearch className="text-2xl" />
        </button>
      </div>
      {/* create content and user section */}
      <div className="h-full w-[25%]  flex flex-row items-center justify-center gap-5 relative">
        <div className="relative">
          <div
            className="h-9 w-30 border border-gray-200 bg-gray-100 rounded-full flex flex-row items-center justify-center gap-1 cursor-pointer"
            onClick={toggleAddContentBox}
          >
            <CiCirclePlus className="text-2xl" />
            <p>Create</p>
            {openAddContentBox === true ? (
              <div className="h-[150px] w-[200px] flex flex-col bg-white absolute top-11 rounded-2xl border border-gray-200 pt-3 gap-2">
                <div className="flex flex-row items-center text-sm font-light gap-2 p-2 hover:bg-gray-200">
                  <IoAddOutline className="text-2xl" />
                  <p>Upload Video</p>
                </div>
                <div className="flex flex-row items-center text-sm font-light gap-2 p-2 hover:bg-gray-200">
                  <IoCreateOutline className="text-2xl" />
                  <p>Cerate Post</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {/* Notification */}
        <div className="hover:bg-gray-200 p-2 rounded-full transform transition-transform duration-700 relative">
          <GoBell className="text-2xl" />
          <div className="h-4 w-6 bg-red-600 rounded-full absolute top-1 left-4.5 flex items-center justify-center">
            <p className="text-white text-sm">5+</p>
          </div>
        </div>
        {/* User Interface */}
        <div className="relative">
          <div
            className="h-10 w-10 bg-gray-200 rounded-full"
            onClick={toggleUserBox}
          ></div>
          {openUserBox === true ? (
            <div className="h-[250px] w-[250px] border border-gray-200 bg-white absolute top-11 right-[-40px] rounded-2xl">
              <div className="h-[100px] w-full border-b-1 border-gray-300 flex  justify-between">
                <div className="h-10 w-10 border border-gray-200 rounded-full bg-gray-200 mt-2 ml-1"></div>
                <div className="h-full w-[75%] p-2">
                  <p>Shivam Kumar</p>
                  <p>shivamgypta123</p>
                  <a href="#" className="text-blue-600 text-sm">
                    View your channel
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <a
                  href="#"
                  className="flex flex-row items-center gap-2 text-[15px] hover:bg-gray-200 p-2"
                >
                  <CiLogin className="text-2xl" />
                  <p>Login</p>
                </a>
                <a
                  href="#"
                  className="flex flex-row items-center gap-2 text-[15px] hover:bg-gray-200 p-2"
                >
                  <MdOutlineFeedback className="text-2xl" />
                  <p>Sendfeedback</p>
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div
        className={`fixed top-15 left-0 h-full  z-40 transform transition-transform duration-700 p-2 bg-white ${
          openSidebox ? "w-[20%]" : "w-[5%]"
        }`}
      >
        <div className="flex flex-col gap-4">
          {openSidebox ? (
            <>
              {sideBoxItems1}
              <hr className="mt-6" />
              {sideBoxItems2}
            </>
          ) : (
            sideBarIcon
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
