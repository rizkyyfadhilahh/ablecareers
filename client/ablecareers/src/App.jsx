import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Education from "./components/education";
import Navbar from "./components/navbar";
import Jobs from "./components/jobs";
import Home from "./components/home";
import Register from "./components/register";
import Login from "./components/login";
import Footer from "./components/footer";
import Careerpage from "./components/careerpage";
import Course from "./components/course";
import Collections from "./components/collections";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              {" "}
              <Navbar />
              <Home />
              <Footer />
            </div>
          }
        />
        <Route
          path="/education"
          element={
            <div className="container">
              <Navbar />
              <Education />
              <Footer />
            </div>
          }
        />
        <Route
          path="/jobs"
          element={
            <div className="container">
              {" "}
              <Navbar /> <Jobs />
              <Footer />
            </div>
          }
        />
        <Route
          path="/jobs/preview/:id"
          element={
            <div className="container">
              {" "}
              <Navbar />
              <Careerpage />
              <Footer />
            </div>
          }
        />
        <Route
          path="/enroll/course/:id"
          element={
            <div className="container">
              {" "}
              <Navbar />
              <Course />
              <Footer />
            </div>
          }
        />
        <Route
          path="/collections/:userID"
          element={
            <div className="container">
              {" "}
              <Navbar />
              <Collections />
              <Footer />
            </div>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
