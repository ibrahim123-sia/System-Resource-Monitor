import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="container mx-auto flex items-center justify-center gap-6 py-4 px-6">
      <Link to="/">Main</Link>
      <Link to="/Processes">Processes</Link>
      <Link to="/CPU">CPU</Link>
      <Link to="/Memory">Memory</Link>
      <Link to="/Disk">Disk</Link>
      <Link to="/GPU">GPU</Link>
    </nav>
  );
};

export default Navbar;
