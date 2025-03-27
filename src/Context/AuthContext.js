import { createContext, useEffect, useState } from "react";
import { getToken } from "../db/tokenService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(async() => {
    const token = await getToken()

    if (token) {
      try {
        const userData = JSON.parse(atob(token.split(".")[1])); 
        setUser(userData);
      } catch (error) {
        console.error("Invalid token", error);
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};