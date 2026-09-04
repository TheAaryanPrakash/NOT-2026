import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const SubNav = () => {
  const { pathname } = useLocation();
  const homePages = [
    {
      id: 1,
      title: "Create New",
      path: "/app",
    },
    { id: 2, title: "My Flashcard", path: "/app/dashboard" },
  ];

  return (
    <div className="mb-10">
      <div>
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-8 text-white"
        >
          Create Flashcard
        </motion.h2>
      </div>

      <nav>
        <ul className="flex items-center gap-6 border-b border-brandBorder">
          {homePages.map(({ title, id, path }) => {
            const isActive = pathname === path;
            return (
              <li key={id} className="relative text-sm font-semibold">
                <NavLink
                  to={path}
                  className={`inline-block pb-3 transition-colors ${
                    isActive
                      ? "text-brandCyan"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {title}
                </NavLink>
                {isActive && (
                  <motion.div
                    layoutId="subnav-active-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute left-0 right-0 -bottom-px h-0.5 bg-brandCyan"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SubNav;
