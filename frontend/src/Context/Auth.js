import axios from "axios";
import React, { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Initialize state from localStorage immediately
    const data = localStorage.getItem("auth");
    if (data) {
      return JSON.parse(data); // { user, token }
    }
    return { user: null, token: "" };
  });

  // Update axios default header whenever token changes
  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common["Authorization"] = auth.token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  // Save auth to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
