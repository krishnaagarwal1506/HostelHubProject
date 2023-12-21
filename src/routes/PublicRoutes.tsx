import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@context/AuthContext";

const PublicRoutes = () => {
  const authContext = useContext(AuthContext);
  if (authContext?.user) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default PublicRoutes;
