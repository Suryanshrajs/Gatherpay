import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { apiUrl } from "@/lib/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${apiUrl}/userInfo`, { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          setUserInfo(res.data.user);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        setUserInfo(null);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${apiUrl}/login`, credentials, {
        withCredentials: true,
      });
      if (res.data.user) {
        setUserInfo(res.data.user);
        setIsAuthenticated(true);
      }
      return res.data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const register = async (credentials) => {
    try {
      const res = await axios.post(`${apiUrl}/register`, credentials, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.error("Register failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    await axios.post(`${apiUrl}/logout`, {}, { withCredentials: true });
    setUserInfo(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userInfo, login, logout, loading, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
