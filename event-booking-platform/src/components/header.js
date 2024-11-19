import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext"; 
import '../App.css';

const Header = () => {
  const { user } = useUser(); 

  return (
    <nav className="navbar">
      <section id="left-corner">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
      </section>
        {user ? (
          // Show profile link when the user is logged in
          <Link to="/profile" className="nav-link">Profile</Link>
        ) : (
          // Show signup and signin links when the user is not logged in
          <>
            <Link to="/signup" className="nav-link">Sign-up</Link>
            <Link to="/signin" className="nav-link">Login</Link>
          </>
        )}
    </nav>
  );
};

export default Header;
