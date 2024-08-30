import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import StarsIcon from "@mui/icons-material/Stars";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

function Navbar() {
  const [userClicked, setUserClicked] = useState(false);
  const [activeTab, setActiveTab] = useState("/");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  function handleClick(e) {
    const { name } = e.target;
    navigate(`/${name}`);
  }

  const isUserExist = localStorage.getItem("username");
  const userID = parseInt(localStorage.getItem("id"));

  const handleUserClick = () => {
    setUserClicked(!userClicked);
  };

  const handleLogOut = async () => {
    try {
      // Send a request to the server to destroy the session
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies with the request
      });

      // Clear local storage items
      localStorage.removeItem("username");
      localStorage.removeItem("id");

      // Redirect to home page
      navigate("/");

      // Optional: Reload the page to ensure all states are reset
      window.location.reload();
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <header>
      <nav>
        <div className="logo">ablecareers</div>
        <div className="borderNav">
          <ul>
            <li
              className={activeTab === "/" ? "active" : ""}
              onClick={() => setActiveTab("/")}
            >
              <Link to="/">Home</Link>
            </li>
            <li
              className={activeTab === "/education" ? "active" : ""}
              onClick={() => setActiveTab("/education")}
            >
              <Link to="/education">Education</Link>
            </li>
            <li
              className={activeTab === "/jobs" ? "active" : ""}
              onClick={() => setActiveTab("/jobs")}
            >
              <Link to="/jobs">Jobs</Link>
            </li>
          </ul>
        </div>
        {isUserExist === null ? (
          <div className="auth-buttons">
            <button className="login" name="login" onClick={handleClick}>
              Login
            </button>
            <button className="register" name="register" onClick={handleClick}>
              Register
            </button>
          </div>
        ) : (
          <div className="user-profile">
            <p> {isUserExist} </p>
            <div className="profile-detail">
              <div className="profile-detail-picture" onClick={handleUserClick}>
                <PersonIcon fontSize="large" id="person-icon" />
                <KeyboardArrowDownIcon className="view-profile-detail" />
              </div>
              {userClicked && (
                <div className="user-account">
                  <div className="user-account-header">
                    <PersonIcon fontSize="large" />
                    <p> {isUserExist} </p>
                  </div>
                  <div
                    className="view-biodata"
                    onClick={() => navigate(`/collections/${userID}`)}
                  >
                    <StarsIcon />
                    <p> Courses & Jobs </p>
                  </div>

                  <div className="logout" onClick={handleLogOut}>
                    <LogoutIcon fontSize="large" id="logout-icon" />
                    <p> Log out</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
