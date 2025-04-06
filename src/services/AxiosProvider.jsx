import { useContext, useEffect } from "react";
import { setAuthToken } from "./Api";
import { userContext } from "../context/UserContext";

const AxiosProvider = ({ children = null }) => {
  // const { token } = useContext(userContext);
  const token = localStorage.getItem('token')

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return children;
};

export default AxiosProvider;
