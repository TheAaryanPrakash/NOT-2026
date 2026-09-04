import React from "react";

const Spinner = () => {
  return (
    <div className="relative h-screen w-full grid place-items-center">
      <span className="w-12 h-12 rounded-full absolute border-4 border-brandBorder"></span>

      <span className="w-12 h-12 rounded-full animate-spin absolute border-4 border-brandCyan border-t-transparent"></span>
    </div>
  );
};

export default Spinner;
