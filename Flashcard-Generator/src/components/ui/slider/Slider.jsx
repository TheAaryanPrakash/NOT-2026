import React from "react";
import { motion } from "framer-motion";

const Slider = ({ term, definition, image, termRef }) => {
  return (
    <motion.div
      ref={termRef}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-10 w-full mt-4 xl:mt-0"
    >
      <div className="bg-brandSurface border border-brandBorder p-6 md:p-10 space-y-4 sm:space-y-0 shadow-sm rounded-xl sm:min-h-[300px] text-white">
       {image && (
          <div>
            <img
              src={image}
              alt={term}
              loading="lazy"
              className="sm:w-96 sm:float-left sm:mr-4 sm:mb-2 aspect-video w-full object-cover rounded-lg"
            />
          </div>
        )}
        <div>
          <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl mb-3 text-brandCyan">{term}</h2>
          <p className="text-gray-300 leading-relaxed text-base md:text-lg">{definition}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Slider;
