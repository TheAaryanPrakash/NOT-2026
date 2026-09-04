import React from "react";
import { BsCheckCircle } from "react-icons/bs";
import { motion } from "framer-motion";

const Toast = ({ fn }) => {
  return (
    <motion.div
      data-testid="toast-dataid"
      initial={{ opacity: 0, y: -40, scale: 0.95, x: "-50%" }}
      animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
      exit={{ opacity: 0, y: -30, scale: 0.95, x: "-50%" }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="p-5 space-y-4 bg-brandSurface border border-brandCyan/40 shadow-glow w-72 sm:w-96 rounded-xl text-white fixed top-2 left-1/2 z-50"
    >
      <div>
        <h3 className="flex flex-col sm:flex-row items-center gap-2 text-lg font-display font-semibold mb-2 text-white">
          <i className="text-2xl text-brandCyan">
            <BsCheckCircle />
          </i>
          Your Flashcard is created.
        </h3>
        <p className="text-gray-400 text-sm">
          Go to My Flashcard tab and check your all of your created flashcards.
        </p>
      </div>
      <div className="text-right">
        <motion.button
          type="button"
          onClick={fn}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className="font-semibold text-sm rounded-md px-4 py-1.5 text-brandCyan min-w-max hover:bg-brandCyan/10 border border-brandCyan/50 transition-colors"
        >
          Dismiss
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Toast;
