import { createContext, useEffect, useState } from "react";
import { getUser } from "../services/Auth";

export const userContext = createContext();

export function UserContextProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await getUser();
          console.log(response);

          // Safely parse JSON fields
          const parsedResponse = {
            ...response,
            skills: safeParseJSON(response.skills, []),
            education: safeParseJSON(response.education, []),
            experience: safeParseJSON(response.experience, []),
          };

          setUser(parsedResponse);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser();
  }, [token]);

  useEffect(() => {
    const handleStorageChange = () => {
      const tok = localStorage.getItem("token");
      if (tok !== token) {
        setToken(tok);
      }
    };

    // Listen for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  const safeParseJSON = (json, fallback) => {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  };

  return (
    <userContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </userContext.Provider>
  );
}
