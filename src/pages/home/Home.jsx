import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <div className="heroBanner">
        <section className="heroContent">
          <h1 className="heroTitle">
            {`Hello,\nWelcome to Programmer's Week 2022!`}
          </h1>
          <Link to="/" className="readMore">
            READ MORE
          </Link>
          <Link to="/join" className="callToActionBtn">
            I want to join
          </Link>
        </section>
      </div>
      <h2 className="homePromptTitle">What do you need today?</h2>

      <ul className="homeNav">
        <li key="career">
          <a
            className="homeNavLink"
            href="https://www.cognizantsoftvision.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cognizant Softvision
          </a>
        </li>
        <li key="cvcreator">
          <a
            className="homeNavLink"
            href="https://cognizantsoftvisionevents.com/programmersweek/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Programmers' Week
          </a>
        </li>
        <li key="foundations">
          <Link className="homeNavLink" to="/foundations">
            Web Components Demo (standalone mfe)
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
