import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Replace with your real auth parsing (token or user object in localStorage)
   useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      setUser({
        name: decoded.name,
        role: decoded.role,   // only if your token contains role
      });
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <Link to="/" className="brand-link">
            <span className="brand-logo">🚗</span>
            <span className="brand-text">Carisma</span>
          </Link>
        </div>
         {user && (
          <div className="user-greeting">
            
            Welcome, {user.name}!
          </div>
        )}

        <nav className={`nav ${open ? "open" : ""}`}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link to="/my-bookings" style={{ color: '#007bff', fontWeight: 'bold' }}>
    My Bookings
  </Link>

          {/* Role-aware links */}
          {user && user.role === "ADMIN" && (
            <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>
          )}

         
           {user ? (
  <>
    <button
      className="btn-ghost"
      onClick={() => { setOpen(false); handleLogout(); }}
    >
      Logout
    </button>
  </>
) : (
  <>
    <Link to="/login" className="btn" onClick={() => setOpen(false)}>Login</Link>
    <Link to="/signup" className="btn" onClick={() => setOpen(false)}>Sign Up</Link>
  </>
)}
          

         
        </nav>

        <button
          className={`hamburger ${open ? "is-active" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Header;
