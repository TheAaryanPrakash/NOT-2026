// main flashcard Top Navbar

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Navbar = ({ Logo }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <header>
      <nav
        className="p-2
        md:px-10
        lg:px-15
        xl:px-20
        bg-black
        border-b-2 border-brandBorder
        flex items-center justify-between
      "
      >
        <div>
          <NavLink to={"/app"}>
            <img className="w-32 " src={Logo} alt="fleshcard-generator" />
          </NavLink>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="font-semibold text-gray-400 hover:text-brandAqua transition-all"
        >
          Sign Out
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
