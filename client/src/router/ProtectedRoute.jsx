import { Navigate, Outlet } from "react-router-dom";
import { PATH } from "@/router/routerConfig";

/*
  ProtectedRoute
  - Checks if JWT token exists
  - If not, redirects to login
  - replace:true prevents back navigation after redirect
*/
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to={PATH.login} replace />;
  }

  return <Outlet />; // ✅ allow access
};

export default ProtectedRoute;
