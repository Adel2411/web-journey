import "./App.css";
import Header from "./components/layout/Header";
import NoteList from "./components/notes/NoteList";
import { LoginForm } from "./components/auth/LoginForm";
import { useState } from "react";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="bg-[#0e0e1b] text-white min-h-screen overflow-x-hidden">
      <Header 
          isAuthenticated={false} // for now false to test
          onSignInClick={() => setShowLogin(true)}
          onSignUpClick={() => {}}
          onSignOutClick={() => {}}
      />

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] border border-[#2c2c3e] rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[#2c2c3e]">
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
              <button 
                onClick={() => setShowLogin(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-[#2a2a3a]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <LoginForm />
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8">
        <NoteList />
      </main>
    </div>
  );
};

export default App;
