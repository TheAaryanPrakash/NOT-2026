import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToHome = () => {
    return navigate(user ? "/app" : "/");
  };
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-5 text-center px-5">
      <h2 className="text-9xl font-bold text-brandAqua">404</h2>
      <h3 className="text-5xl text-gray-300">Page Not Found</h3>
      <div>
        <p className="text-gray-400 mb-7 border-b-2 border-brandBorder pb-2">
          Sorry, the page you are looking for could not be found.
        </p>
        <button
          onClick={goToHome}
          className="px-6 py-2 bg-gradient-to-br from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-md font-semibold transition-all"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
