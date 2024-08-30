import React, { useState } from "react";
import "./footer.css";
import whatsapp from "../../public/whatsapp.png";
import instagram from "../../public/instagram.png";
import twitter from "../../public/twitter.png";
import axios from "axios";

function footer() {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:3000/push/email", {
        data: email,
      });

      if (result.status == 200) {
        console.log("See your email for our latest information");
        setEmail("");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <footer className="education-footer">
      <h1>ablecareers</h1>
      <div className="footer-mid">
        <div className="footer-left">
          <ul>
            <li id="topic">Help & Support</li>
            <li>
              <a href="https://linktr.ee/vincentiusjg">Contact Us</a>
            </li>
          </ul>
          <ul>
            <li id="topic">Features</li>
            <li>
              <a href="https://linktr.ee/vincentiusjg">Career Counseling </a>
            </li>
            <li>
              <a href="/jobs">Job Opportunities</a>
            </li>
          </ul>
          <ul>
            <li id="topic">Company</li>
            <li>
              <a href="https://www.canva.com/design/DAGO7rrGGEA/DilOYwbCMQiaA7VYI3-Mdg/edit?utm_content=DAGO7rrGGEA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton">
                {" "}
                About Us
              </a>
            </li>
            <li>
              <a href="https://www.canva.com/design/DAGO7rrGGEA/DilOYwbCMQiaA7VYI3-Mdg/edit?utm_content=DAGO7rrGGEA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton">
                {" "}
                Our Team
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-right">
          <div className="footer-right-email">
            <p>
              Enter your email to receive the latest updates and news from us
            </p>
            <form className="email-inputfield" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                id="email-footer"
                placeholder="Enter your email"
                onChange={handleChange}
                value={email}
              />
              <input
                type="submit"
                value="SEND"
                id="submit-email"
                name="submit"
              />
            </form>
          </div>
          <div className="footer-right-media">
            <p>Follow us</p>
            <div className="social-media">
              <a href="https://wa.me/081292039645">
                {" "}
                <img src={whatsapp} />
              </a>
              <a href="https://www.instagram.com/vincentiusjg/">
                {" "}
                <img src={instagram} />
              </a>
              <a href="">
                {" "}
                <img src={twitter} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>@ 2024 Ablecareers</p>
      </div>
    </footer>
  );
}

export default footer;
