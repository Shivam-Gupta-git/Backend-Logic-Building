import React from "react";

function UploadVideos() {
  return (
    <div className="h-[100vh] w-[100%] flex items-center justify-center mt-[-6%]">
      <div className="h-[80%] w-[50%] border p-5 rounded border-gray-300 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            className="mt-1 block px-3 py-2 border border-gray-300 w-full rounded shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Enter Video title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-2">
            Description
          </label>
         <textarea  rows="4" className="w-full mt-2 p-2 border border-gray-300 rounded shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"></textarea>
        </div>
      </div>
    </div>
  );
}

export default UploadVideos;
