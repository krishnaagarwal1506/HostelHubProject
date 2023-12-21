import { createContext, useState, PropsWithChildren, useEffect } from "react";
import axios from "axios";
import Loader from "@components/Loader";
import AlertComponent from "@components/Alert";
import useAlert from "@src/hooks/useAlert";
import { UserDetailsType } from "@ts/types";
import {
  fetchData,
  getLocalStorage,
  deleteLocalStorage,
  setLocalStorage,
  catchErrorMessage,
} from "@utils/index";
import {
  GOOGLE_LOGIN_URL,
  USER_LOGIN_URL,
  USER_DATA_URL,
  ERROR,
  SUCCESS,
} from "@constant/index";

type AuthContextType = {
  user: UserDetailsType;
  updateUserDetails: (updatedUserDetails: UserDetailsType) => void;
  getUser: () => Promise<void>;
  isLoading: boolean;
  handleLogout: (showAlert: boolean) => void;
  handleLogin: (email: string, password: string) => void;
  handleGoogleLogin: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: {
    id: null,
    name: "",
    email: "",
    role: "",
  },
  updateUserDetails: () => {},
  getUser: () => new Promise<void>(() => {}),
  isLoading: true,
  handleLogout: () => {},
  handleLogin: () => {},
  handleGoogleLogin: () => {},
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserDetailsType | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { alert, handleAlert } = useAlert();
  const { isOpen, message, severity } = alert;

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    return new Promise<void>((resolve, reject) => {
      const token = getLocalStorage("jwtToken");
      if (!token) {
        setisLoading(false);
        resolve();
        return;
      }
      fetchData(USER_DATA_URL + "?populate=*")
        .then((response) => {
          const {
            id,
            username,
            email,
            role: { type },
            student,
          } = response;
          setUser({
            id,
            name: student ? student.studentName : username,
            email,
            role: type,
          });
          resolve();
        })
        .catch((error) => {
          setError("Something went wrong");
          handleAlert(true, error.message, ERROR);
          reject(error);
        })
        .finally(() => {
          setisLoading(false);
        });
    });
  };

  function updateUserDetails(updatedUserDetails: UserDetailsType) {
    setUser(updatedUserDetails);
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append("identifier", email);
      formData.append("password", password);
      const response = await axios.post(USER_LOGIN_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setLocalStorage("jwtToken", response.data.jwt);
        await getUser();
        handleAlert(true, "Logged in successfully", SUCCESS);
      } else {
        handleAlert(true, "Unable to Log in", ERROR);
      }
    } catch (error) {
      handleAlert(true, catchErrorMessage(error), ERROR);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  function handleLogout(showAlert: boolean = true) {
    setUser(null);
    deleteLocalStorage("jwtToken");
    showAlert && handleAlert(true, "Logged out successfully", SUCCESS);
  }

  if (isLoading && !error) return <Loader />;

  return (
    <AuthContext.Provider
      value={{
        user: user!,
        updateUserDetails,
        isLoading,
        getUser,
        handleLogout,
        handleLogin,
        handleGoogleLogin,
      }}
    >
      {children}
      {isOpen && (
        <AlertComponent
          message={message}
          severity={severity}
          handleClose={() => handleAlert(false)}
        />
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
