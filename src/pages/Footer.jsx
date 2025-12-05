import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h4>Carisma</h4>
          <p>Reliable car rentals & trusted drivers. Book with confidence.</p>
        </div>

        <div className="footer-col">
          <h5>Quick Links</h5>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <h5>Contact</h5>
          <p>Email: support@gulfishar.example</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>

      <div className="footer-bottom">
        <small>© {new Date().getFullYear()} Carisma — All rights reserved</small>
      </div>
    </footer>
  );
};

export default Footer;
