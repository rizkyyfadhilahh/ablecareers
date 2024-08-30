import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./collections.css";
import WorkIcon from "@mui/icons-material/Work";
import ChecklistIcon from "@mui/icons-material/Checklist";

function Collections() {
  const { userID } = useParams();
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [viewCourses, setViewCourses] = useState(true);

  console.log("UserID:", userID);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const result = await axios.get(
          `http://localhost:3000/courses/${userID}`
        );
        console.log("Course fetch result:", result);

        if (result.status === 200) {
          setCourses(result.data);
          console.log("Courses set:", result.data);
        }
      } catch (err) {
        console.log("Error fetching courses:", err.message);
      }
    };

    const fetchJobs = async () => {
      try {
        const getJob = await axios.get(`http://localhost:3000/jobs/${userID}`);

        if (getJob.status === 200) {
          setJobs(getJob.data);
        }
      } catch (err) {
        console.log("Error fetching jobs:", err.message);
      }
    };

    fetchCourse();
    fetchJobs();
  }, [userID]);

  return (
    <div className="collections-outer">
      <div className="collections-options">
        <ul>
          <li
            style={{ borderBottom: viewCourses ? "8px solid gold" : "none" }}
            onClick={() => setViewCourses(true)}
          >
            Courses
          </li>
          <li
            style={{ borderBottom: !viewCourses ? "5px solid gold" : "none" }}
            onClick={() => setViewCourses(false)}
          >
            Jobs
          </li>
        </ul>
      </div>

      <div className="collections-container">
        {viewCourses ? (
          courses.length > 0 ? (
            courses.map((course) => (
              <div className="course-collection" key={course.id}>
                <h1>{course.name}</h1>
                <img src={course.course_thumbnail} alt={course.name} />
              </div>
            ))
          ) : (
            <div className="error-message">
              <h2>You haven't enrolled in any courses.</h2>
            </div>
          )
        ) : jobs.length > 0 ? (
          <div className="jobs-collection-container">
            <div className="jobs-collections">
              {jobs.map((job) => (
                <div className="jobs-collection" key={job.id}>
                  <div className="job-collection-header">
                    <img
                      src={job.company_logo}
                      alt={job.company}
                      width="130px"
                    />
                    <h1>{job.company}</h1>
                  </div>
                  <h1>{job.name}</h1>
                  <p>{job.location}</p>
                  <div className="job-collection-detail">
                    <div className="job-collection-detail-card">
                      <WorkIcon />
                      <p>{job.workplace}</p>
                      <p>{job.schedules}</p>
                    </div>
                    <div className="job-collection-detail-card">
                      <ChecklistIcon />
                      <p>Skills:</p>
                      <p>{job.skills}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p>
              *Further announcements will be sent to the email address you have
              registered
            </p>
          </div>
        ) : (
          <div className="error-message">
            <h2>You haven't applied for any job</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Collections;
