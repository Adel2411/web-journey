import "./App.css";
import Header from "./components/layout/Header";
import NoteList from "./components/notes/NoteList";
import { AuthLayout } from "./components/auth/AuthLayout";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "./contexts/AuthContext";

const App = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const isAuthenticated = !!user;
  
  const [showLogin, setShowLogin] = useState(!isAuthenticated);
  const [showRegister, setShowRegister] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

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
    logout();
    setShowWelcome(false);
    setShowLogin(true);
    closeModal();
  };

  const handleAuthSuccess = () => {
    setShowWelcome(true);
    closeModal();
    
    // Hide welcome message after 4 seconds
    setTimeout(() => {
      setShowWelcome(false);
    }, 4000);
  };

  useEffect(() => {
    if (isAuthenticated) {
      setShowLogin(false);
      setShowRegister(false);
    } else {
      setShowLogin(true);
    }
  }, [isAuthenticated]);

  // Loading state
  if (loading) {
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
          {/* Conditional welcome message with fade animation */}
          {showWelcome && (
            <div className="mb-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4 transition-all duration-500 ease-in-out">
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {user?.name}!</h1>
              <p className="text-gray-300">Manage your notes and collaborate with others.</p>
            </div>
          )}
          
          <NoteList />
        </main>
      )}
    </div>
  );
};

export default App;