import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { path } from "../constants/path";

export const RejectedRoute = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (isAuthenticated) {
    return user.role === "ADMIN" ? (
      <Navigate to={path.homeAdmin} />
    ) : (
      <Navigate to={path.home} />
    );
  }
  
  return <Outlet />;
};

export const UserProtectedRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={path.login} />;
  }
  
  // if (user.role !== "USER") {
  //   return user.role === "ADMIN" ? (
  //     <Navigate to={path.homeAdmin} />
  //   ) : (
  //     <Navigate to={path.home} />
  //   );
  // }
  
  return <Outlet />;
};

export const AdminProtectedRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={path.login} />;
  }
  
  if (user.role !== "ADMIN") {
    return <Navigate to={path.home} />;
  }
  
  return <Outlet />;
};