import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/api";
import { decodeJWT, isTokenExpired } from "../utils/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on app start
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        
        if (token && token.trim() !== "" && token !== "null" && token !== "undefined") {
          // Check if token is expired
          if (isTokenExpired(token)) {
            localStorage.removeItem("token");
            setUser(null);
            return;
          }

          const decoded = decodeJWT(token);
          if (decoded) {
            const userInfo = {
              id: decoded.userId,
              name: decoded.name || "User",
              role: decoded.role,
              initials: (decoded.name || "UN")
                .split(" ")
                .map(n => n[0])
                .join("")
                .toUpperCase()
            };
            setUser(userInfo);
          } else {
            localStorage.removeItem("token");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginUser(email, password);
      const { token, user: userData } = response.data;
      
      localStorage.setItem("token", token);
      
      // Create consistent user object
      const userInfo = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        initials: (userData.name || "UN")
          .split(" ")
          .map(n => n[0])
          .join("")
          .toUpperCase()
      };
      
      setUser(userInfo);
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: err.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const { email, password, confirmPassword, name, age, role } = userData;
      
      const response = await registerUser(
        email,
        password,
        confirmPassword,
        name,
        age,
        role
      );
      
      const { token, user: registeredUser } = response.data;
      
      localStorage.setItem("token", token);
      
      const userInfo = {
        id: registeredUser.id,
        name: registeredUser.name,
        email: registeredUser.email,
        role: registeredUser.role,
        initials: (registeredUser.name || "UN")
          .split(" ")
          .map(n => n[0])
          .join("")
          .toUpperCase()
      };
      
      setUser(userInfo);
      return { success: true };
    } catch (err) {
      console.error("Registration error:", err);
      return { success: false, message: err.message || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        loading, 
        setLoading,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};