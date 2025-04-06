import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { AxiosApi } from "../services/Api";
import { getUser } from "../services/Auth";

export const userContext = createContext();

export function UserContextProvider({ children }) {
  let [token, setToken] = useState(localStorage.getItem("token"));
  let [user, setUser] = useState(null);
  // let [isOpen,setOpen] = useState(false)
  const safeParse = (data) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(data) ? data : [];
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
            try {
        const response = await getUser();
        console.log("Raw API response:", response);
        // response.skills = JSON.parse(response.skills);
        // response.education = JSON.parse(response.education);
        // response.experience = JSON.parse(response.experience);
        response.skills = response.skills 
        ? (typeof response.skills === 'string' 
            ? response.skills.split(',') 
            : response.skills)
        : [];

      // Normalize education (ensure it's always an array)
      response.education = Array.isArray(response.education) 
        ? response.education 
        : (response.education ? [response.education] : []);

      // Normalize experience (handle string, object, or array)
      if (!response.experience) {
        response.experience = [];
      } else if (typeof response.experience === 'string') {
        response.experience = [{ description: response.experience }];
      } else if (!Array.isArray(response.experience)) {
        response.experience = [response.experience];
      }

      setUser(response);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
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
