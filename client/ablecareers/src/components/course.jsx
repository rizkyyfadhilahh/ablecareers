import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./course.css";

function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [applied, setApplied] = useState(false);
  const currentUserID = parseInt(localStorage.getItem("id"));
  const courseID = parseInt(id);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const result = await axios.get(
          `http://localhost:3000/get/course/${id}`
        );

        setCourse(result.data);

        console.log("current user id: ", currentUserID);
        console.log("id: ", parseInt(id));
        const checkApplied = await axios.get(
          `http://localhost:3000/course/enrolled/${currentUserID}/${courseID}`
        );

        if (checkApplied.status === 200) {
          setApplied(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchCourse();
  }, [id, currentUserID]);

  if (!course) {
    return <p>Loading...</p>;
  }

  const handleJoinCourse = async () => {
    try {
      const enrollUser = await axios.post(
        `http://localhost:3000/enrolled/${currentUserID}/${id}`
      );

      if (enrollUser.status === 200) {
        setApplied(true); // Update the button state
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="courses-container">
      <h1>{course.name}</h1>
      <div className="course-detail-header">
        <img src={course.course_thumbnail} alt={course.name} />
        <div className="course-detail">
          <div className="course-detail-content">
            <p className="course-detail-content-date"> Date</p>
            <p className="course-detail-content-bold">{course.course_date}</p>
          </div>
          <div className="course-detail-content">
            <p className="course-detail-content-date"> Time </p>
            <p className="course-detail-content-bold">
              {course.timestart} - {course.timeend}
            </p>
          </div>
          <div className="course-detail-content">
            <p className="course-detail-content-date"> Onsite/Online</p>
            <p className="course-detail-content-bold">{course.course_mode}</p>
          </div>
          <div className="course-detail-content">
            <p className="course-detail-content-date"> Location</p>
            <p className="course-detail-content-bold">{course.location}</p>
          </div>
          <button
            id={applied ? "joined-course" : "join-course"}
            onClick={handleJoinCourse}
            disabled={applied}
          >
            {applied ? "Enrolled" : "Join For FREE"}
          </button>
        </div>
      </div>

      <div className="course-about">
        <h1> About the course</h1>
        <p>{course.description}</p>
      </div>
    </div>
  );
}

export default Course;
