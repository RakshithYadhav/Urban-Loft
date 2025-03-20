import { createContext, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const login = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem("token", data.token);
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = { token, user, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
