import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1>404</h1>
        <h2>Oops! Page not found</h2>
        <p>
          We couldn’t find the page you’re looking for.
        </p>

        <Link to="/" className="home-btn">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
