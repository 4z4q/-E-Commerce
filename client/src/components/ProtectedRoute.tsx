import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace={true} />; // replace={true} will replace the current URL in the browser history
  }

  return <Outlet />;
};

export default ProtectedRoute;
