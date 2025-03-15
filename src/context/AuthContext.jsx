import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthContext = createContext();

const TOKEN_KEY = "token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!token;

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/doctor/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Session expired, please login again";
        toast.error(errorMessage);
        console.error(err);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setToken(null);
        navigate("/login");
      }
    };
    localStorage.setItem(TOKEN_KEY, token);
    fetchUser();
  }, [token, navigate]);

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  }

  function login(newToken) {
    if (!newToken) {
      throw new Error("New token is required to login");
    }
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    toast.success("Logged in successfully");
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
