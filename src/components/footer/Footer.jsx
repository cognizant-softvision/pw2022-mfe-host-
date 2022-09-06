import React from 'react';

import { Link } from 'react-router-dom';

import './Footer.css';

export const Footer = () => {
  return (
    <div className="footer" key="Layout">
      <ul>
        <li>
          <Link to="/" className="links">Join Us</Link>
        </li>
        <li>
          <Link to="/" className="links">About</Link>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
