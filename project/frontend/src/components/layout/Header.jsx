// Header.jsx
import { useState } from "react";

const Header = ({
  isAuthenticated,
  user,
  onSignInClick,
  onSignUpClick,
  onSignOutClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const UserAvatar = () => (
    <div className="relative hidden md:group">
      <button className="flex items-center justify-center w-9 h-9 rounded-full bg-cyan-100 text-cyan-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
        {user?.initials || "UN"}
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-[#2a2a3a] rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out origin-top-right">
        <a
          href="/profile"
          className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#3a3a4f]"
        >
          Profile
        </a>
        <a
          href="/settings"
          className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#3a3a4f]"
        >
          Settings
        </a>
        <button
          onClick={onSignOutClick}
          className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#3a3a4f] border-t border-[#444]"
        >
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <header className="bg-[#1a1a2e] border-b border-[#2c2c3e] shadow-sm sticky top-0 z-50 text-white">
      <div className="max-w-6xl mx-auto px-1 py-3 sm:px-4 sm:py-4 flex justify-between items-center">
        {/* Logo / Title */}
        <a href="/" className="flex items-center group">
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors duration-200">
            CollabNote
          </h1>
        </a>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2 sm:gap-4">
          {/* Search Input */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search notes..."
              className="pl-9 pr-3 py-1.5 rounded-full border border-gray-600 bg-[#2a2a3a] text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-500 text-sm w-48 lg:w-64 transition"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <div className="hidden md:block">
              <UserAvatar />
            </div>
          ) : (
            <>
              <button
                onClick={onSignInClick}
                className="hidden md:block text-xs sm:text-sm font-medium text-gray-300 hover:text-cyan-400 transition px-2 py-1 sm:px-3 sm:py-1.5"
              >
                Sign In
              </button>
              <button
                onClick={onSignUpClick}
                className="hidden md:block bg-cyan-600 hover:bg-cyan-700 text-white text-xs sm:text-sm font-medium py-1.5 px-3 sm:py-2 sm:px-4 rounded-md shadow-md hover:shadow-lg transition"
              >
                Sign Up
              </button>
            </>
          )}

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-gray-300 hover:text-cyan-400 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1a1a2e] py-4 border-t border-[#2c2c3e] shadow-md text-white">
          {/* ADDED PX-4 HERE for overall padding of the menu content. */}
          <nav className="flex flex-col items-center gap-3 px-4">
            {isAuthenticated ? (
              <>
                <a
                  href="/profile"
                  className="block text-gray-200 hover:text-cyan-400 w-full py-2 text-center"
                >
                  Profile
                </a>
                <a
                  href="/settings"
                  className="block text-gray-200 hover:text-cyan-400 w-full py-2 text-center"
                >
                  Settings
                </a>
                <button
                  onClick={onSignOutClick}
                  className="block text-gray-200 hover:text-cyan-400 w-full py-2 text-center"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onSignInClick}
                  className="flex justify-center items-center text-gray-200 bg-[#2d2d42] hover:bg-[#3b3b58] w-full py-2 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  Sign In
                </button>
                <button
                  onClick={onSignUpClick}
                  className="flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 text-white w-full py-2 rounded-md transition duration-150 ease-in-out"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Optional Search for mobile */}
            <div className="relative w-full mt-2">
              <input
                type="text"
                placeholder="Search notes..."
                className="pl-8 pr-3 py-2 rounded-md border border-gray-600 bg-[#2a2a3a] text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-500 text-sm w-full"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
