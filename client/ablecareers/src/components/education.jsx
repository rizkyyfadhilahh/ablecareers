import React, { useEffect, useState } from "react";
import "./education.css";
import star from "../../public/star.png";
import search from "../../public/search.png";
import notLogged from "../../public/information.png";

import { useNavigate } from "react-router-dom";
import axios from "axios";

function Education() {
  const [courses, setCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCourses, setFilterCourses] = useState([]);
  const [searchCourses, setSearchCourses] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [noSearchResults, setNoSearchResults] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await axios.get("http://localhost:3000/get/courses");
        setCourses(result.data);
        setPopularCourses(
          result.data.sort((a, b) => b.enrolled - a.enrolled).slice(0, 8)
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();

    const checkUser = localStorage.getItem("username");
    if (checkUser) {
      setIsUserLogged(true);
    }
  }, []);

  const handleFilterClick = async (e) => {
    const filter = e.target.getAttribute("data-filter");
    setActiveFilter(filter);
    setSearchQuery("");

    try {
      const result = await axios.get(
        `http://localhost:3000/get/courses?filter=${filter}`
      );
      setFilterCourses(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setActiveFilter("");
    const query = e.target.elements.education.value;
    setSearchQuery(query);

    try {
      const result = await axios.get(
        `http://localhost:3000/get/courses?search=${query}`
      );
      setSearchCourses(result.data);
      setNoSearchResults(result.data.length === 0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEnroll = (e, course) => {
    e.preventDefault();
    if (isUserLogged) {
      navigate(`/enroll/course/${course.id}`);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  const getBackgroundStyle = (rating) => {
    if (rating == 5) {
      return { background: "linear-gradient(to bottom, #d1b8e5, #9f9cc4)" };
    } else if (rating >= 4.7 && rating <= 4.9) {
      return { background: "linear-gradient(to bottom, #af4cab, #e97474)" };
    } else if (rating >= 4.4 && rating <= 4.6) {
      return { background: "linear-gradient(to right, #c1e0b2, #d4bf54)" };
    } else if (rating >= 4 && rating <= 4.3) {
      return { background: "linear-gradient(to bottom, #71d24f, #6f8a96)" };
    } else if (rating < 4) {
      return { background: "linear-gradient(to right, #b2e0c9, #f7da8b)" };
    }
  };

  return (
    <div className="content">
      {showLoginPrompt && (
        <div className="login-prompt-overlay">
          <div className="login-prompt">
            <h2>Please Log In</h2>
            <p>You need to log in to enroll in a course.</p>
            <img
              src={notLogged}
              width="100px"
              height="100px"
              alt="Not Logged In"
            />
            <div className="logged-buttons">
              <button onClick={() => navigate("/login")}>Log In</button>
              <button onClick={closeLoginPrompt}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className={`search-education ${showLoginPrompt ? "blurred" : ""}`}>
        <h1>Education Tailored for Every Individual</h1>
        <form className="input-field" onSubmit={handleSearch}>
          <img src={search} alt="search" />
          <input
            type="text"
            name="education"
            id="education"
            placeholder="Education title or keyword"
          />
          <input
            type="submit"
            name="submit-button"
            id="submit"
            value="Search"
          />
        </form>
      </div>

      <div
        className={`education-filter-container ${
          showLoginPrompt ? "blurred" : ""
        }`}
      >
        <ul className="education-filter">
          <li data-filter="Physical Disabilities" onClick={handleFilterClick}>
            Physical Disabilities
          </li>
          <li
            data-filter="Intellectual Disabilities"
            onClick={handleFilterClick}
          >
            Intellectual Disabilities
          </li>
          <li data-filter="Mental Disabilities" onClick={handleFilterClick}>
            Mental Disabilities
          </li>
          <li data-filter="Sensory Disabilities" onClick={handleFilterClick}>
            Sensory Disabilities
          </li>
          <li data-filter="Multiple Disabilities" onClick={handleFilterClick}>
            Multiple Disabilities
          </li>
          <li
            data-filter="Autism Spectrum Disorders"
            onClick={handleFilterClick}
          >
            Autism Spectrum Disorders
          </li>
          <li data-filter="Acquired Brain Injuries" onClick={handleFilterClick}>
            Acquired Brain Injuries
          </li>
          <li
            data-filter="Neurological Disabilities"
            onClick={handleFilterClick}
          >
            Neurological Disabilities
          </li>
        </ul>
      </div>

      {(activeFilter || searchQuery) && (
        <div className="filter-results">
          <h1>
            Courses{" "}
            {activeFilter
              ? `related to "${activeFilter}"`
              : `matching "${searchQuery}"`}
          </h1>
          {noSearchResults ? (
            <p>There is no course related to "{searchQuery}"</p>
          ) : (
            <div className="filtered-educations">
              {(activeFilter ? filterCourses : searchCourses).map((course) => (
                <div
                  className="course"
                  key={course.id}
                  style={getBackgroundStyle(course.rating)}
                >
                  <div className="course-header">
                    <div className="course-header-ratings">
                      <img src={star} alt="star" />
                      <p>{course.rating}</p>
                    </div>
                  </div>
                  <h2>{course.name}</h2>
                  <div className="course-footer">
                    <p>{course.enrolled} students</p>
                    <button
                      onClick={(e) => handleEnroll(e, course)}
                      className="enroll"
                    >
                      Enroll now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        className={`popular-educations-container ${
          showLoginPrompt ? "blurred" : ""
        }`}
      >
        <h1>Most Popular</h1>
        <div className="popular-educations">
          {loading ? (
            <p>Loading...</p>
          ) : (
            popularCourses.map((course) => (
              <div
                className="course"
                key={course.id}
                style={getBackgroundStyle(course.rating)}
              >
                <div className="course-header">
                  <div className="course-header-ratings">
                    <img src={star} alt="star" />
                    <p>{course.rating}</p>
                  </div>
                </div>
                <h2>{course.name}</h2>
                <div className="course-footer">
                  <p>{course.enrolled} students</p>
                  <button
                    onClick={(e) => handleEnroll(e, course)}
                    className="enroll"
                  >
                    Enroll now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Education;
