import React, { useContext, useEffect, useState } from "react";
import { ChannelContext } from "../context/ChannelContext";
import axios from "axios";
import { IoCloudUploadOutline } from "react-icons/io5"

function Login() {
  const { navigate, backendURl, token, setToken } = useContext(ChannelContext);

  const [currentState, setCurrentState] = useState("Login");
  const [fullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handelFormButton = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      if (currentState === "Sign Up") {
        // Validate required fields
        if (!fullName || !email || !userName || !password || !avatar) {
          setErrorMessage("All fields are required for registration");
          return;
        }

        // Create FormData for file uploads - THIS IS CRITICAL!
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("userName", userName);
        formData.append("password", password);
        formData.append("avatar", avatar);
        formData.append("coverImage", coverImage);

        const response = await axios.post(
          backendURl + "/api/user/register",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        if (response.data.success) {
          setToken(response.data.accessToken);
          localStorage.setItem("token", response.data.accessToken);
          navigate("/");
        } else {
          setErrorMessage(response.data.message || "Registration failed");
        }
      } else {
        if (!email || !password) {
          setErrorMessage("Email and password are required");
          return;
        }
        const response = await axios.post(backendURl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.accessToken);
          localStorage.setItem("token", response.data.accessToken);
          navigate("/");
        } else {
          setErrorMessage(response.data.message || "Login failed");
        }
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong!";
      setErrorMessage(`⚠️ ${msg}`);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="h-[100%] w-[100%] bg-transparent z-50 flex items-center justify-center">
      <div className="w-[50%] bg-white rounded-lg shadow-lg border p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {currentState === "Login" ? "Login Form" : "Sign Up Form"}
        </h2>

        {/* show error */}
        {errorMessage && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handelFormButton}>
          {currentState === "Login" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  UserName
                </label>
                <input
                  type="text"
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your UserName"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700">
                  Upload Avatar
                </label>
                <div className="h-[80px] w-[80px] border flex items-center justify-center mt-1 rounded-full overflow-hidden border-gray-200 shadow-sm">
                      {!avatar ? (
                        <IoCloudUploadOutline className="text-4xl"></IoCloudUploadOutline>
                      ) : (
                        <img src={URL.createObjectURL(avatar)} alt={``}  className="h-full w-full object-cover"/>
                      )}
                </div>
                <input
                  type="file"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="flex flex-col items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Cover Image
                </label>
                <div className="h-[100px] w-[70%] border flex items-center justify-center mt-1 rounded-xl overflow-hidden border-gray-200 shadow-sm">
                 {!coverImage ? (
                  <IoCloudUploadOutline className="text-4xl"></IoCloudUploadOutline>
                 ) : (
                  <img src={URL.createObjectURL(coverImage)} alt="" />
                 )}
                </div>
                <input
                  type="file"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mt-2"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {currentState === "Login" ? "Sign In" : "Sign Up"}
          </button>
          <p className="mt-2 text-center text-sm">
            {currentState === "Login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <div className="flex items-center justify-center">
            {currentState === "Login" ? (
              <a
                onClick={() => setCurrentState("Sign Up")}
                className="cursor-pointer text-blue-500 hover:text-red-600"
              >
                Create Account
              </a>
            ) : (
              <a
                onClick={() => setCurrentState("Login")}
                className="cursor-pointer text-blue-500 hover:text-red-600"
              >
                Login
              </a>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
