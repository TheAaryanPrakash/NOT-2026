import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToHome = () => {
    return navigate(user ? "/app" : "/");
  };
  return (
    <div className="relative min-h-screen bg-brandBg text-white flex flex-col items-center justify-center gap-5 text-center px-5 overflow-hidden font-sans">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-[40%] left-[45%] w-[28rem] h-[28rem] rounded-full bg-brandCyan/10 blur-[120px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-[55%] left-[55%] w-[20rem] h-[20rem] rounded-full bg-brandRed/10 blur-[120px]"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.h2
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative font-display text-8xl sm:text-9xl font-bold text-brandCyan"
      >
        404
      </motion.h2>
      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="relative font-display text-3xl sm:text-4xl text-white"
      >
        🌙 Page Not Found
      </motion.h3>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="relative"
      >
        <p className="text-gray-500 mb-7 pb-4 border-b border-brandBorder">
          Sorry, the page you are looking for could not be found.
        </p>
        <motion.button
          onClick={goToHome}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="px-6 py-2.5 bg-brandCyan hover:bg-white text-black rounded-xl font-semibold transition-colors"
        >
          Return Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;
