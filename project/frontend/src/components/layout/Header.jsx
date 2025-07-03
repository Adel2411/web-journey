import React from 'react';
import logoPic from '../../assets/lecriture1.png';
import '../../App.css';

export default function Header() {
  return (
    <header className="bg-[#FDFAF6] p-4 shadow font-lato">
      <div className="flex items-center gap-4">
        <img src={logoPic} alt="Logo" className="h-10 w-auto" />
        <h2 className="text-2xl font-bold text-gray-800">CollabNote</h2>
      </div>
    </header>
  );
}
