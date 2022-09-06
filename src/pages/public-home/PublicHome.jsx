
import React from 'react';

import { Link } from "react-router-dom";

import './PublicHome.css'

const PublicHome = () => {
  return (
    <div className="homeContainerPublic">
      <div className="overlayTextContainer">
        <section className="heroContent">
          <h1 className="title">{`Hello,\nWelcome to Programmer's Week 2022!`}</h1>
          <p>This is a POC to show several MFEs interactions using Webpacks' Module Federation and Web Components with Shadow DOM for encapsulation.</p>
          <Link className="callToActionBtn" to="/login">
            I want to join
          </Link>
        </section>
      </div>
    </div>
  );
};

export default PublicHome;
