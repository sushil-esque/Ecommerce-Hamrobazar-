import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";

function ProtectedRoute({ children, isAdminRoute = false }) {
  const { user, setRedirectTo, isLoggedIn } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      setRedirectTo(location.pathname);
    }
  }, [isLoggedIn, location.pathname, setRedirectTo]);

  if (!isLoggedIn) {
    console.log("not logged in");
    return <Navigate to="/login" replace />;
  }

  if (isAdminRoute && user?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;
