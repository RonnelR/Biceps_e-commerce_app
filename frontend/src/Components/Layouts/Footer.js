import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const getYear = new Date().getFullYear();

  return (
    <div className="footer-top bg-info text-light text-center p-3">
      <h5>BICEPS &copy; {getYear} | All rights reserved</h5>
      <div>
        <Link to="/About" className="footer">
          About
        </Link>
        |
        <Link to="/Contact" className="footer">
          Contact
        </Link>
        |
        <Link to="/Privacy" className="footer">
          Privacy
        </Link>
      </div>
    </div>
  );
};

export default Footer;
