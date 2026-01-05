import { Navigate, Outlet } from "react-router-dom";
import { PATH } from "@/router/routerConfig";

const PublicRoute = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to={PATH.home} replace />;
  }

  return <Outlet />; // ✅ allow access
};

export default PublicRoute;
