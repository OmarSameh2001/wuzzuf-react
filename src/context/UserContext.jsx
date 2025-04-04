import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { AxiosApi } from "../services/api";
import { getUser } from "../services/Auth.js";

export const userContext = createContext();

export function UserContextProvider({ children }) {
  let [token, setToken] = useState(null);
  let [user, setUser] = useState(null);
  // let [isOpen,setOpen] = useState(false)
  useEffect(() => {
    const tok = localStorage.getItem("token");
    if (tok) setToken(tok);
  }, []);
  useLayoutEffect(() => {
    const fetchUser = async () => {
      if (token) {
        const response = await getUser();
        setUser(response);
      }
    };
    fetchUser();
  }, [token]);
  useEffect(()=>{
    console.log(user)
  }, [user])
  return (
    <userContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </userContext.Provider>
  );
}
