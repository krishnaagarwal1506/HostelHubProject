import { ReactElement, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@context/AuthContext";

type RouteWrapperProps = {
  components: { [key: string]: ReactElement };
};

const RouteWrapper = ({ components }: RouteWrapperProps) => {
  const {
    user: { role },
  } = useContext(AuthContext);
  return role ? components?.[role] : <Navigate to="/login" />;
};
export default RouteWrapper;
