// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    setUser(null); // Clear user data on logout
  };

  return (
    <nav className="navbar">
      <div className="CompanyName">
        <h1>SAHKA</h1>
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
      <div className="user-section">
        {user ? (
          <div className="dropdown">
            <button className="dropdown-button">{user.name} ▼</button>
            <div className="dropdown-content">
              <Link to="/profile">Profile</Link> {/* Link to Profile page */}
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div>
            <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
