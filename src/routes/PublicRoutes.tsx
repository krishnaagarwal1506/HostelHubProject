import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@context/AuthContext";

const PublicRoutes = () => {
  const authContext = useContext(AuthContext);
  if (authContext !== null && authContext.user !== null) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default PublicRoutes;
