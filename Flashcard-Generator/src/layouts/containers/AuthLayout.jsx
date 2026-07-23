import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo.png";

const AuthLayout = ({ title, children, footerText, footerLinkText, footerLinkTo }) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-5 py-10">
      <NavLink to="/" className="mb-8">
        <img className="w-32" src={Logo} alt="flashcard-generator" />
      </NavLink>
      <div className="bg-brandSurface shadow-md rounded-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-brandAqua">
          {title}
        </h1>
        {children}
        {footerText && (
          <p className="text-center text-gray-400 mt-6">
            {footerText}{" "}
            <NavLink to={footerLinkTo} className="text-brandAqua font-semibold">
              {footerLinkText}
            </NavLink>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
