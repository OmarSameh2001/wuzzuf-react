import { useEffect } from "react";
import { AxiosApi, setAuthToken } from "./api";

const AxiosProvider = ({ children }) => {
  useEffect(() => {
    // Check for token in this order:
    // 1. First try localStorage (persisted sessions)
    // 2. Then check sessionStorage (temporary sessions)
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setAuthToken(token);
    
    // Optional: Add response interceptor
    const interceptor = AxiosApi.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Handle token expiration
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Cleanup the interceptor when component unmounts
      AxiosApi.interceptors.response.eject(interceptor);
    };
  }, []);

  return children;
};

export default AxiosProvider;