import { Routes, Route, Link, Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user, redirectPath = "/login", children }) => {
  if (!user.token && !user.email) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
