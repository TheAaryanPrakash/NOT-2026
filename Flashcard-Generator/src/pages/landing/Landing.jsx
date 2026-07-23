import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import fullMoon from "../../assets/landing/full-moon.jpg";
import "./landing.css";

const Landing = () => {
  const { user } = useAuth();
  const appLink = user ? "/app" : "/signup";

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="d-flex align-items-center">
          <NavLink to="/">
            <img src={fullMoon} alt="Logo" />
          </NavLink>
          {!user && (
            <nav>
              <NavLink to={appLink}>Flashcards.</NavLink>
            </nav>
          )}
        </div>
        <div className="auth-links">
          {user ? (
            <NavLink to="/app" className="sign-in">
              My Flashcards.
            </NavLink>
          ) : (
            <>
              <NavLink to="/signup" className="sign-in">
                Sign Up.
              </NavLink>
              <NavLink to="/login" className="sign-in">
                Sign In.
              </NavLink>
            </>
          )}
        </div>
      </header>

      {/* Intro Section */}
      <section className="intro-section">
        <div className="intro-content">
          <h1 className="inria-sans-bold">NOT.</h1>
          <p>Notes on Time</p>
          <div className="intro-moon"></div>
        </div>
      </section>

      {/* Flashcards Section */}
      <section className="flashcard-section">
        <NavLink to={appLink} className="card">
          FLASH CARDS.
        </NavLink>
        <div className="moon-center"></div>
      </section>
    </div>
  );
};

export default Landing;
