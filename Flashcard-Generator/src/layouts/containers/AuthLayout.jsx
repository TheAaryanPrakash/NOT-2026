import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../../assets/logo.png";

const AuthLayout = ({ title, children, footerText, footerLinkText, footerLinkTo }) => {
  return (
    <div className="relative min-h-screen bg-brandBg text-white flex flex-col items-center justify-center px-5 py-10 overflow-hidden font-sans">
      {/* Ambient duotone glow field */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-20 w-[30rem] h-[30rem] rounded-full bg-brandCyan/15 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-20 w-[30rem] h-[30rem] rounded-full bg-brandRed/10 blur-[120px]"
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <NavLink to="/" className="relative mb-8 block">
          <img className="w-28" src={Logo} alt="flashcard-generator" />
        </NavLink>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.1 }}
        className="relative bg-brandSurface border border-brandBorder shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="font-display text-2xl font-semibold mb-6 text-center text-white">
          {title}
        </h1>
        {children}
        {footerText && (
          <p className="text-center text-gray-500 mt-6 text-sm">
            {footerText}{" "}
            <NavLink to={footerLinkTo} className="text-brandCyan font-semibold hover:text-white transition-colors">
              {footerLinkText}
            </NavLink>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default AuthLayout;
