import axios from "axios";
import {toast} from'sonner'

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/", 
  withCredentials: true,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again");
        localStorage.removeItem("token");
        window.location.href = "/"; 
        if (error.response?.status === 403) {
          toast.error("You dont have permission to access this resource");
        }
      }
      return Promise.reject(error);
    }
)
  

export default axiosInstance;
