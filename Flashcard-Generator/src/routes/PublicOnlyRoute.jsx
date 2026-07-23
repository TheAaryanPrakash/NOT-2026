import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/spinner/Spinner";

// Keeps logged-in users out of /login and /signup
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (user) return <Navigate to="/app" replace />;

  return children;
};

export default PublicOnlyRoute;
