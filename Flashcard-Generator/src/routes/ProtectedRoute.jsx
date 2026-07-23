import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/spinner/Spinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
