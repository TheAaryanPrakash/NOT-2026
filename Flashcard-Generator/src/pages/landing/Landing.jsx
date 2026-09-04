import React, { Suspense, lazy } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/logo.png";

// Three.js/R3F are only needed on this page — code-split so /app, /login,
// etc. never download the 3D renderer.
const ScrollMoon = lazy(() => import("../../components/landing/ScrollMoon"));

const Landing = () => {
  const { user } = useAuth();
  const appLink = user ? "/app" : "/signup";

  return (
    <div className="min-h-screen bg-brandBg text-white font-sans overflow-x-hidden">
      <Suspense fallback={null}>
        <ScrollMoon />
      </Suspense>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 sm:px-10 py-4 bg-brandBg/80 backdrop-blur-md border-b border-brandBorder"
      >
        <div className="flex items-center gap-8">
          <NavLink to="/">
            <img src={Logo} alt="NOT." className="w-24" />
          </NavLink>
          {!user && (
            <nav className="hidden sm:block">
              <NavLink
                to={appLink}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Flashcards.
              </NavLink>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <NavLink
                to="/app"
                className="block text-sm font-semibold px-4 py-2 rounded-lg bg-brandCyan text-black hover:bg-white transition-colors"
              >
                My Flashcards.
              </NavLink>
            </motion.div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-semibold text-gray-300 hover:text-white transition-colors px-3 py-2"
              >
                Sign In.
              </NavLink>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <NavLink
                  to="/signup"
                  className="block text-sm font-semibold px-4 py-2 rounded-lg bg-brandCyan text-black hover:bg-white transition-colors"
                >
                  Sign Up.
                </NavLink>
              </motion.div>
            </>
          )}
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-5 pt-24 pb-16">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-[35%] left-[38%] w-[44rem] h-[44rem] rounded-full bg-brandCyan/10 blur-[140px]"
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-[55%] left-[60%] w-[26rem] h-[26rem] rounded-full bg-brandRed/10 blur-[140px]"
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative text-center max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-mono text-xs sm:text-sm tracking-[0.3em] text-brandCyan uppercase mb-6"
          >
            🌙 Notes on Time
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.2 }}
            className="font-display text-7xl sm:text-9xl font-bold tracking-tight text-white"
          >
            NOT<span className="text-brandCyan">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-gray-400 text-lg sm:text-xl mt-6 max-w-xl mx-auto"
          >
            Turn your notes into flashcards in seconds — paste text, drop a
            PDF, or snap a photo, and study smarter.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 20 } }}
              whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 20 } }}
              animate={{
                boxShadow: [
                  "0 0 30px -8px rgba(34,229,238,0.35)",
                  "0 0 50px -8px rgba(34,229,238,0.55)",
                  "0 0 30px -8px rgba(34,229,238,0.35)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ borderRadius: "0.75rem" }}
            >
              <NavLink
                to={appLink}
                className="block px-8 py-3.5 rounded-xl bg-brandCyan text-black font-semibold text-lg hover:bg-white transition-colors"
              >
                {user ? "Go to Dashboard" : "Get Started"}
              </NavLink>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Flashcard preview section */}
      <section className="relative px-5 pb-24 sm:pb-32">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <NavLink
              to={appLink}
              className="group relative block rounded-2xl border border-brandBorder bg-brandSurface p-10 sm:p-16 text-center overflow-hidden transition-colors hover:border-brandCyan/50"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1 bg-gradient-to-br from-brandCyan/10 via-transparent to-brandRed/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <span className="relative inline-block font-display text-3xl sm:text-5xl font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-brandCyan">
                Flash Cards.
              </span>
              <p className="relative text-gray-500 mt-4 text-sm sm:text-base">
                Create a set, generate one with AI, or study what you've already
                got &mdash; all in one place.
              </p>
            </NavLink>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
