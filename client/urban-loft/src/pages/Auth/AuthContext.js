import { createContext, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const login = () => {};
  const logout = () => {};

  const value = { token, user, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
