import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loginData, setLoginData] = useState({
    fullname: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleClick(e) {
    e.preventDefault();
    const isEmptyField = Object.values(loginData).some((value) => value === "");
    try {
      if (isEmptyField) {
        setErrorMsg("Please fill in all the fields!");
      } else {
        const result = await axios.post(
          "http://localhost:3000/auth/login",
          loginData
        );

        if (result.status === 200) {
          console.log("Successful login");
          console.log(loginData);
          localStorage.setItem("username", loginData.fullname);
          localStorage.setItem("id", result.data.id);
          navigate("/");
        }
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.status === 404) {
          setErrorMsg(err.response.data.message || "User not found");
        } else if (err.response.status === 401) {
          setErrorMsg(err.response.data.message || "Incorrect password");
        } else {
          setErrorMsg("An error occurred during login.");
        }
      } else {
        setErrorMsg("An error occurred during login.");
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-image">
        <h1>ablecareers</h1>
      </div>
      <div className="login-form">
        <h1>Welcome back!</h1>
        <form>
          <input
            type="text"
            name="fullname"
            id="fullname"
            placeholder="Username"
            value={loginData.fullname}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
          />
          <input
            type="submit"
            onClick={handleClick}
            id="submit-login"
            value="Login"
          />
          <p id="form-info">
            {" "}
            Dont have an account?{" "}
            <a
              href="/register"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {" "}
              Register
            </a>
          </p>
          <p id="error"> {errorMsg} </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
