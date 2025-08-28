import "./App.css";
import Header from "./components/layout/Header";
import NoteList from "./components/notes/NoteList";
import { AuthLayout } from "./components/auth/AuthLayout";
import { useState } from "react";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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

  return (
    <div className="bg-[#0e0e1b] text-white min-h-screen overflow-x-hidden">
      <Header 
        isAuthenticated={false}
        onSignInClick={() => setShowLogin(true)}
        onSignUpClick={() => setShowRegister(true)}
        onSignOutClick={() => {}}
      />

      <AuthLayout 
        showLogin={showLogin}
        showRegister={showRegister}
        closeModal={closeModal}
        switchToRegister={switchToRegister}
        switchToLogin={switchToLogin}
      />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8">
        <NoteList />
      </main>
    </div>
  );
};

export default App;
