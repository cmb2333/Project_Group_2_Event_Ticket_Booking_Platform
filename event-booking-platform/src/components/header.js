import React from "react";
import { Link } from "react-router-dom";
import '../App.css';

const Header = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/signup" className="nav-link">Signup</Link>
      <Link to="/signin" className="nav-link">Signin</Link>
      <Link to="/dashboard" className="nav-link">Dashboard</Link>
    </nav>
  );
};

export default Header;
