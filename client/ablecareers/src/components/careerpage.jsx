import React, { useState, useEffect } from "react";
import "./careerpage.css";
import WorkIcon from "@mui/icons-material/Work";
import Work from "@mui/icons-material/Work";
import ChecklistIcon from "@mui/icons-material/Checklist";
import IosShareIcon from "@mui/icons-material/IosShare";
import linkedin from "../../public/linkedin.png";
import { useParams } from "react-router-dom";
import axios from "axios";

function careerpage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const currentUserID = parseInt(localStorage.getItem("id"));
  const jobID = parseInt(id);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const result = await axios.get(`http://localhost:3000/get/job/${id}`);
        setJob(result.data);

        const checkApplied = await axios.get(
          `http://localhost:3000/job/applied/${currentUserID}/${jobID}`
        );

        if (checkApplied.status === 200) {
          setIsApplied(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchJob();
  }, [id, currentUserID]);

  if (!job) {
    return <p>Loading...</p>;
  }

  const handleApply = async () => {
    try {
      const applyUser = await axios.post(
        `http://localhost:3000/applied/${currentUserID}/${id}`
      );

      if (applyUser.status === 200) {
        setIsApplied(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-job-preview">
      <div className="card-job-preview">
        <div className="company-logo-preview">
          <img
            width="200px"
            height="200px"
            src={job.company_logo}
            alt="companyLogo"
          />
          <h2> {job.company}</h2>
        </div>
        <div className="job-detail">
          <h1> {job.name} </h1>
          <p> {job.location}</p>
          <div className="requirements-container">
            <div className="requirements-preview">
              <WorkIcon />
              <p> {job.workplace} </p>
              <p> {job.schedules} </p>
            </div>
            <div className="requirements-preview">
              <ChecklistIcon />
              <p> Skills: {job.skills} </p>
            </div>
          </div>

          <button
            id={isApplied ? "applied-btn" : "apply-job-btn"}
            disabled={isApplied}
            onClick={handleApply}
          >
            {" "}
            {isApplied ? (
              "Applied"
            ) : (
              <>
                Apply <IosShareIcon />
              </>
            )}
          </button>
        </div>

        <div className="job-descriptions">
          <h1> About the job</h1>
          <p> {job.description}</p>

          <h3 class="subtopic"> Job Description</h3>
          <h5> Responsibilities: </h5>
          <div dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
          <h5> Qualifications: </h5>
          <div dangerouslySetInnerHTML={{ __html: job.qualifications }} />
          <h5> What We Offer: </h5>
          <div dangerouslySetInnerHTML={{ __html: job.our_offer }} />
          <h5> Application Process: </h5>
          <p>
            {" "}
            We encourage applications from individuals with disabilities and
            will work with candidates to ensure a smooth and accessible
            application process. If you require any accommodations during the
            application or interview process, please let us know.
          </p>
        </div>
        <div className="about-company">
          <h1> About the company</h1>
          <div className="company-logo-preview">
            <img width="120px" height="120px" src={job.company_logo} />
            <h3> {job.company}</h3>
          </div>
          <p> {job.name}</p>
          <div className="company-about">
            <p> {job.about_company} </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default careerpage;
