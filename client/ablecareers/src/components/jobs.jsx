import React, { useEffect, useState } from "react";
import "./jobs.css";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import notLogged from "../../public/information.png";

function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const renderJobs = async () => {
      try {
        const result = await axios.get("http://localhost:3000/get/jobs");
        if (result.data) {
          setJobs(result.data);
          setDisplayedJobs(result.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    renderJobs();

    const checkUser = localStorage.getItem("username");
    if (checkUser) {
      setIsUserLogged(true);
    }
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const categoryFilteredJobs = jobs.filter((job) =>
        job.type.includes(selectedCategory)
      );
      setDisplayedJobs(categoryFilteredJobs);
    } else if (!searchQuery) {
      setDisplayedJobs(jobs);
    }
  }, [selectedCategory, jobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      const searchFilteredJobs = jobs.filter((job) =>
        job.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayedJobs(searchFilteredJobs);
      setSelectedCategory("");
    } else {
      setDisplayedJobs(jobs);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
  };

  const handleApplyClick = (jobId) => {
    if (!isUserLogged) {
      setShowLoginPrompt(true);
    } else {
      navigate(`/jobs/preview/${jobId}`);
    }
  };

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  return (
    <div className="job-container">
      {showLoginPrompt && (
        <div className="login-prompt-overlay">
          <div className="login-prompt">
            <h2>Please Log In</h2>
            <p>You need to log in to apply for jobs.</p>
            <img
              src={notLogged}
              width="100px"
              height="100px"
              alt="Not Logged"
            />
            <div className="logged-buttons">
              <button onClick={() => navigate("/login")}>Log In</button>
              <button onClick={handleCloseLoginPrompt}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className={`container-job ${showLoginPrompt ? "blurred" : ""}`}>
        <section className="hero">
          <h1>
            Opportunities for All,
            <br />
            Success for Everyone
          </h1>
          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-bar-left">
              <SearchIcon fontSize="large" />
              <input
                type="text"
                id="job-input"
                name="job-input"
                placeholder="Search for a job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <input type="submit" value="Search" id="search-job" />
          </form>
        </section>
      </div>

      <section className={`job-categories ${showLoginPrompt ? "blurred" : ""}`}>
        {/* Category Filters */}
        <div
          className="category"
          onClick={() => handleCategoryClick("Physical Disabilities")}
        >
          Physical Disabilities
        </div>
        <div
          className="category"
          onClick={() => handleCategoryClick("Intellectual Disabilities")}
        >
          Intellectual Disabilities
        </div>
        <div
          className="category"
          onClick={() => handleCategoryClick("Mental Disabilities")}
        >
          Mental Disabilities
        </div>
        <div
          className="category"
          onClick={() => handleCategoryClick("Sensory Disabilities")}
        >
          Sensory Disabilities
        </div>
        <div
          className="category"
          onClick={() => handleCategoryClick("Multiple Disabilities")}
        >
          Multiple Disabilities
        </div>
        <div
          className="category"
          onClick={() => handleCategoryClick("Autism Spectrum Disorders")}
        >
          Autism Spectrum Disorders
        </div>
        <div
          className="category"
          onClick={() => handleCategoryClick("Acquired Brain Injuries")}
        >
          Acquired Brain Injuries
        </div>
        <div
          className="category"
          onClick={() => handleCategoryClick("Neurological Disabilities")}
        >
          Neurological Disabilities
        </div>
      </section>

      <section className={`job-listings ${showLoginPrompt ? "blurred" : ""}`}>
        {loading ? (
          <p>Loading...</p>
        ) : displayedJobs.length === 0 ? (
          <p>There is no job related to "{searchQuery || selectedCategory}"</p>
        ) : (
          displayedJobs.map((job) => (
            <div className="job-card" key={job.id}>
              <div className="job-header">
                <img
                  src={job.company_logo}
                  alt={`${job.company_name} Logo`}
                  className="company-logo"
                />
              </div>
              <h3>{job.name}</h3>
              <p className="location">{job.location}</p>
              <p>{job.workplace}</p>
              <p>{job.type}</p>
              <button
                className="apply-button"
                onClick={() => handleApplyClick(job.id)}
              >
                Apply
              </button>
              <p className="disclaimer">
                Applications are welcomed from all individuals, regardless of
                gender.
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Jobs;
