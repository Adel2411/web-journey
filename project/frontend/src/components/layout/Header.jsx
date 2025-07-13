import { Search } from "lucide-react";

const Header = ({ search, setSearch }) => {
  return (
    <header className="w-full bg-white shadow-lg shadow-gray-300 py-5 px-6">

      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* Left: Logo / Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-wide">
          CollabNote
        </h1>

        {/* Center: Search Bar */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 border border-gray-200 shadow-md px-4 py-2 rounded-xl w-72">
          <Search className="w-4 h-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search notes..."
            className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-500"
            value={search}
            onChange={(e)=>{setSearch(e.target.value)}}
          />
        </div>

        {/* Right: Auth Placeholder */}
        <div className="text-gray-600 text-sm font-medium hidden sm:block">
          Authentication
        </div>
      </div>
    </header>
  );
};

export default Header;
