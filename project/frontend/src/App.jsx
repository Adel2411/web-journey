import "./App.css";
import Header from "./components/layout/Header";
import NoteList from "./components/notes/NoteList";
import { AuthLayout } from "./components/auth/AuthLayout";
import { useState, useEffect } from "react";
import { isTokenExpired, decodeJWT } from "./utils/auth";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const closeModal = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
      closeModal();
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const handleAuthSuccess = (userData, token) => {
    try {
      localStorage.setItem("token", token);
      setUser(userData);
      setIsAuthenticated(true);
      closeModal();
    } catch (error) {
      console.error("Error saving authentication:", error);
    }
  };

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        
        if (token && token.trim() !== "" && token !== "null" && token !== "undefined") {

          // Check if token is expired
          if (isTokenExpired(token)) {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setUser(null);
            setShowLogin(true);
            return;
          }

          const userData = decodeJWT(token);
          
          if (userData) {
            const userInfo = {
              id: userData.id || userData.userId || userData.sub,
              name: userData.name || userData.username || `${userData.firstName} ${userData.lastName}` || "User",
              email: userData.email,
              initials: (userData.name || userData.username || "UN").split(' ').map(n => n[0]).join('').toUpperCase()
            };
            
            setUser(userInfo);
            setIsAuthenticated(true);
            
          } else {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setUser(null);
            setShowLogin(true);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setShowLogin(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setUser(null);
        setShowLogin(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#0e0e1b] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0e0e1b] text-white min-h-screen overflow-x-hidden">
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onSignInClick={() => setShowLogin(true)}
        onSignUpClick={() => setShowRegister(true)}
        onSignOutClick={handleSignOut}
      />

      {/* Conditional content */}
      {!isAuthenticated ? (
        <AuthLayout
          showLogin={showLogin}
          showRegister={showRegister}
          closeModal={closeModal}
          switchToRegister={switchToRegister}
          switchToLogin={switchToLogin}
          onAuthSuccess={handleAuthSuccess}
        />
      ) : (
        <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-400">Manage your notes and collaborate with others.</p>
          </div>
          <NoteList />
        </main>
      )}
    </div>
  );
};

export default App;