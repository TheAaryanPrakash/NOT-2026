import React from "react";
import { motion } from "framer-motion";

const Button = ({ text, btnclass, fn, type, disabled, title }) => {
  return (
    <motion.button
      onClick={fn}
      type={type}
      title={title}
      disabled={disabled}
      className={btnclass}
      whileHover={!disabled ? { scale: 1.04 } : undefined}
      whileTap={!disabled ? { scale: 0.94 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {text}
    </motion.button>
  );
};

export default Button;
