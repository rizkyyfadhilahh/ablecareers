import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./register.css";
import bg1 from "../../public/wheelcair.png";

function Register() {
  const [registerData, setRegisterData] = useState({
    email: "",
    fullname: "",
    password: "",
    confirmpassword: "",
    phonenumber: "",
    type: "",
    gender: "",
    interests: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  function handleChange(e) {
    const { name, value } = e.target;

    setRegisterData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  async function handleClick(e) {
    e.preventDefault();
    const isEmptyField = Object.values(registerData).some(
      (value) => value === ""
    );
    try {
      if (isEmptyField) {
        setErrorMsg("Please fill in all the field!");
      } else if (registerData.password != registerData.confirmpassword) {
        setErrorMsg("Password must be the same as verify password");
      } else {
        setErrorMsg("");

        const result = await axios.post(
          "http://localhost:3000/auth/register",
          registerData
        );

        if (result.status === 200) {
          console.log(result.data);
          setErrorMsg("");
          navigate("/login");
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setErrorMsg(err.response.data.message);
      } else {
        console.log("Registration error: ", err);
      }
    }
  }

  const background1 = `url(${bg1})`;

  return (
    <div className="regist-container">
      <div className="regist-image" style={{ backgroundImage: background1 }}>
        <h1>ablecareers</h1>
      </div>

      <div className="regist-form">
        <h1>
          Unlock your career potential with opportunities that match your unique
          skills.
        </h1>
        <form method="POST">
          <div className="forms">
            <div className="left-form">
              <input
                type="email"
                name="email"
                id="email-register"
                placeholder="Email"
                onChange={handleChange}
              />
              <input
                type="text"
                name="fullname"
                id="fullname"
                placeholder="Full name"
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={handleChange}
              />
              <input
                type="password"
                name="confirmpassword"
                id="confirmpassword"
                placeholder="Confirm Password"
                onChange={handleChange}
              />
            </div>

            <div className="right-form">
              <input
                type="text"
                name="phonenumber"
                id="phonenumber"
                placeholder="Phone Number"
                onChange={handleChange}
              />
              <input
                type="text"
                name="type"
                id="type"
                placeholder="Types of disabilities"
                onChange={handleChange}
              />

              <input
                type="text"
                name="gender"
                id="gender"
                placeholder="Gender"
                onChange={handleChange}
              />
              <input
                type="text"
                name="interests"
                id="interests"
                placeholder="Interests"
                onChange={handleChange}
              />
            </div>
          </div>

          <input
            type="submit"
            onClick={handleClick}
            id="submit-register"
            value="Register"
          />
          <p id="form-info">
            {" "}
            Already have an account?{" "}
            <a
              href="/login"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {" "}
              Login{" "}
            </a>
          </p>
          <p id="error"> {errorMsg} </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
