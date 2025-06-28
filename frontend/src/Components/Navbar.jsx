import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Moon } from "lucide-react";

const NavLink = memo(({ to, children }) => (
  <Link to={to} className="hover:text-blue-400 transition duration-300">
    {children}
  </Link>
));

export default function Navbar() {
  return (
    <nav className="container flex items-center justify-between py-2 px-6 bg-gray-800 text-white rounded-2xl shadow-lg min-w-full">
      <div>
        <h1 className="text-3xl font-extrabold tracking-wide text-blue-400">SRM</h1>
      </div>

      <div className="flex space-x-8 text-lg font-medium">
        <NavLink to="/">Main</NavLink>
        <NavLink to="/Processes">Processes</NavLink>
        <NavLink to="/CPU">CPU</NavLink>
        <NavLink to="/Memory">Memory</NavLink>
        <NavLink to="/Disk">Disk</NavLink>
        <NavLink to="/GPU">GPU</NavLink>
      </div>

      <div>
        <button
          className="p-2 rounded-full bg-gray-700 hover:bg-blue-500 transition duration-300"
        >
          <Moon size={22} />
        </button>
      </div>
    </nav>
  );
}