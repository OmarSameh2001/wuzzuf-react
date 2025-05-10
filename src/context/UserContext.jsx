import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { getUser } from "../services/Auth";

export const userContext = createContext();

export function UserContextProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatBot, setChatBot] = useState(false);
  const [isLight, setIsLight] = useState(true);
  const [update, setUpdate] = useState({ user: {}, settings: {} });

  const refetchUser = async (tok) => {
    if (!token && !tok && !localStorage.getItem("token")) return; // Exit if no token
    try {
      const response = await getUser(tok || token);
      setUser(response);
      setToken(localStorage.getItem("token") || tok || token);
      setLoading(false);
    } catch (error) {
      setLoading(false); 
      console.error("Error fetching user data:", error);
    }
  };
  // useLayoutEffect(() => {
  //   const fetchUser = async () => {
  //     if (localStorage.getItem("token")) {
  //       try {
  //         setLoading(true);
  //         const response = await getUser(token);
  //         // console.log(response);

  //         // Safely parse JSON fields
  //         const parsedResponse = {
  //           ...response,
  //           skills: safeParseJSON(response.skills, []),
  //           education: safeParseJSON(response.education, []),
  //           experience: safeParseJSON(response.experience, []),
  //         };

  //         setUser(parsedResponse);
  //         setToken(localStorage.getItem("token"));
  //         // console.log(parsedResponse.img);
  //         // console.log(token,parsedResponse);
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //       } finally {
  //         setLoading(false); // Set loading to false when done
  //       }
  //     } else {
  //       setLoading(false); // Also set loading false if no token
  //     }
  //   };

  //   fetchUser();
  // }, [localStorage.getItem("token")]);


  useLayoutEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getUser(token);
        const parsedResponse = {
          ...response,
          skills: safeParseJSON(response.skills, []),
          education: safeParseJSON(response.education, []),
          experience: safeParseJSON(response.experience, []),
          track: safeParseJSON(response.track, []),
          branch: safeParseJSON(response.branch, []),
          grad_year: safeParseJSON(response.iti_grad_year, []),
        };
        setUser(parsedResponse);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     const tok = localStorage.getItem("token");
  //     if (tok !== token) {
  //       setToken(tok);
  //     }
  //   };

  //   // Listen for changes in localStorage
  //   window.addEventListener("storage", handleStorageChange);

  //   // Cleanup listener on unmount
  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, [token]);

  const safeParseJSON = (json, fallback) => {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  };

  return (
    <userContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        refetchUser,
        chatBot,
        setChatBot,
        isLight,
        setIsLight,
        update,
        setUpdate,
        loading,
        setLoading,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
