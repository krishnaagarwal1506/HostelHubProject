import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "@context/AuthContext";
import Loader from "@components/Loader";
import AlertComponent from "@components/Alert";
import useAlert from "@src/hooks/useAlert";
import { setLocalStorage } from "@utils/index";
import { GOOGLE_LOGIN_CALLBACK } from "@src/constant";

type PrivateRouteProps = {
  allowedRoles: string[];
};

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const { handleLogout, getUser } = authContext;
  const location = useLocation();
  const navigate = useNavigate();
  const { alert, handleAlert } = useAlert();
  const { isOpen, message, severity } = alert;

  useEffect(() => {
    const getToken = async () => {
      const accessToken = location.search.split("id_token=")[1];
      if (!accessToken) return setLoading(false);
      try {
        const {
          data: { jwt },
        } = await axios.get(GOOGLE_LOGIN_CALLBACK + `?id_token=${accessToken}`);
        if (jwt) {
          setLocalStorage("jwtToken", jwt);
          await getUser();
          handleAlert(true, "Login Successful", "success");
          navigate("/dashboard", { replace: true });
        } else {
          handleAlert(true, "Login Failed", "error");
        }
        setLoading(false);
      } catch (error) {
        handleLogout(false);
        handleAlert(true, "Login Failed", "error");
        setLoading(false);
      }
    };
    getToken();
  }, [location]);

  if (loading) return <Loader />;
  if (!authContext?.user) {
    return <Navigate to="/login" />;
  }
  const {
    user: { role },
  } = authContext;
  return (
    <>
      {allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/forbidden" />}
      {isOpen && (
        <AlertComponent
          message={message}
          severity={severity}
          handleClose={() => handleAlert(false)}
        />
      )}
    </>
  );
};
export default PrivateRoute;
