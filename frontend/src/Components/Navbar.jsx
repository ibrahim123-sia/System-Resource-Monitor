import { Link } from "react-router-dom";
import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [darkTheme, setDarkTheme] = useState(true);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <nav className="container flex items-center justify-between py-2 px-6 bg-gray-800 text-white rounded-2xl shadow-lg min-w-full">

      
     
      <div>
        <h1 className="text-3xl font-extrabold tracking-wide text-blue-400">SRM</h1>
      </div>

     
      <div className="flex space-x-8 text-lg font-medium">
        <Link to="/" className="hover:text-blue-400 transition duration-300">Main</Link>
        <Link to="/Processes" className="hover:text-blue-400 transition duration-300">Processes</Link>
        <Link to="/CPU" className="hover:text-blue-400 transition duration-300">CPU</Link>
        <Link to="/Memory" className="hover:text-blue-400 transition duration-300">Memory</Link>
        <Link to="/Disk" className="hover:text-blue-400 transition duration-300">Disk</Link>
        <Link to="/GPU" className="hover:text-blue-400 transition duration-300">GPU</Link>
      </div>

      
      <div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-700 hover:bg-blue-500 transition duration-300"
        >
          {darkTheme ? <Moon size={22} /> : <Sun size={22} />}
        </button>
      </div>

    </nav>
  );
}
