// main flashcard Top Navbar

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";

const Navbar = ({ Logo }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 px-3 pt-3 md:px-6 md:pt-6"
    >
      <nav
        className="max-w-6xl mx-auto flex items-center justify-between gap-4
        rounded-full bg-brandSurface/90 backdrop-blur-md border border-brandBorder
        px-3 py-1.5 md:px-4 shadow-lg
      "
      >
        <NavLink to={"/app"} className="block shrink-0">
          <img className="w-24" src={Logo} alt="flashcard-generator" />
        </NavLink>
        <motion.button
          type="button"
          onClick={handleSignOut}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="font-semibold text-sm text-gray-300 hover:text-white transition-colors rounded-full px-4 py-2 border border-brandBorder hover:border-brandCyan/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brandCyan/50"
        >
          Sign Out
        </motion.button>
      </nav>
    </motion.header>
  );
};

export default Navbar;
