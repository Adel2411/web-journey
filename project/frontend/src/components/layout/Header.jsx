// import React from "react";

// const Header = () => {
//   return (
//     <header className="bg-white shadow-md p-4 mb-6">
//       <div className="max-w-6xl mx-auto flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-blue-500">CollabNote</h1>
//         {/* Future: Auth buttons */}
//       </div>
//     </header>
//   );
// };

// export default Header;
// src/components/layout/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              CollabNote
            </h1>
          </div>

          {/* Navigation (placeholder for future features) */}
          <nav className="flex items-center space-x-6">
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-500 transition-colors font-medium"
            >
              Notes
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-500 transition-colors font-medium"
            >
              Shared
            </a>
            {/* Placeholder for authentication */}
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">JD</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;