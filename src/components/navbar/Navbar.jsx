import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { logout, UserContext } from "context/UserContext";
import "./Navbar.css";

const projectPrefix = "REPLACE WITH REMOTE!!!";
const projectSufix = "";

const Navbar = () => {
  const [user, dispatch] = useContext(UserContext);

  const signOut = () => {
    dispatch(logout());
  };

  return (
    <div className="navbar">
      <div>
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="project">
            <span className="projectPrefix semi-bold">{projectPrefix}</span>
            <span className="projectSufix semi-bold">{projectSufix}</span>
          </div>
        </Link>
      </div>

      <div className="userArea">{/* center */}</div>

      <div className="navActions">
        <>
          <Link to="/about" className="navLink">
            About
          </Link>
          <Link to="/join" className="navLink">
            Join
          </Link>
          {user.logged ? (
            <Link to="/" className="navLink" onClick={signOut}>
              {user.name}
            </Link>
          ) : (
            <Link to="/login" className="navLink">
              Login
            </Link>
          )}
        </>
      </div>
    </div>
  );
};

export default Navbar;
