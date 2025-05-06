import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { path } from "../constants/path";

export const RejectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />;
};

export const UserProtectedRoute = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={path.login} />;
  }
  if (user.role !== "USER") {
    return <Navigate to={path.home} />;
  }
  return <Outlet />;
};

export const AdminProtectedRoute = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={path.loginAdmin} />;
  }
  if (user.role !== "ADMIN") {
    return <Navigate to={path.home} />;
  }
  return <Outlet />;
};