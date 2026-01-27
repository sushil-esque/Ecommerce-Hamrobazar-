import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";

function ProtectedRoute({ children, isAdminRoute = false }) {
  const { user, setRedirectTo, isLoggedIn, isInitialized } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      setRedirectTo(location.pathname);
    }
  }, [isLoggedIn, isInitialized, location.pathname, setRedirectTo]);

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

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
