import axios, { AxiosInstance } from "axios";
import { BASE_URL } from "@constant/index";
import { deleteLocalStorage, getLocalStorage } from "@utils/index";

const axiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
  });
  instance.interceptors.request.use(
    (config) => {
      const token = getLocalStorage("jwtToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      else window.location.href = "/login";
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        deleteLocalStorage("jwtToken");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosInstance;
