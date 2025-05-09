import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    
    <nav className="container flex items-center justify-between py-2 px-6 bg-gray-800 text-white rounded-2xl
     shadow-lg  min-w-full">
      
      
      <div>
        <h1 className="text-2xl font-bold">SRM</h1>
      </div>
      
      <div className="flex space-x-6">
        <Link to="/" className="hover:text-blue-400 transition">Main</Link>
        <Link to="/Processes" className="hover:text-blue-400 transition">Processes</Link>
        <Link to="/CPU" className="hover:text-blue-400 transition">CPU</Link>
        <Link to="/Memory" className="hover:text-blue-400 transition">Memory</Link>
        <Link to="/Disk" className="hover:text-blue-400 transition">Disk</Link>
        <Link to="/GPU" className="hover:text-blue-400 transition">GPU</Link>
      </div>
      
      <div>
        <p className="cursor-pointer hover:text-blue-400 transition">Theme</p>
      </div>

    </nav>
  );
}
