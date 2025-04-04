import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { AxiosApi } from "../services/Api";
import { getUser } from "../services/Auth";

export const userContext = createContext();

export function UserContextProvider({ children }) {
  let [token, setToken] = useState(null);
  let [user, setUser] = useState(null);
  // let [isOpen,setOpen] = useState(false)
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        const response = await getUser();
        console.log(response)
        setUser(response);
      }
    };
    fetchUser();
  }, [token]);
  useEffect(() => {
    const tok = localStorage.getItem("token");
    if (tok) setToken(tok);
  }, []);
  
  useEffect(()=>{
    console.log(user)
  }, [user])
  return (
    <userContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </userContext.Provider>
  );
}
