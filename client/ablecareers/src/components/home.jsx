import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import waitressimg from "../../public/waitress.jpg";
import laptop from "../../public/peoplewithlaptop.jpg";
import david from "../../public/david.jpg";
import naya from "../../public/naya.jpg";
import unicef from "../../public/unicef.png";
import rakuten from "../../public/rakuten.png";
import kemnaker from "../../public/kemnaker.png";
import linkedin from "../../public/linkedin.png";
import act from "../../public/act.png";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
function home() {
  const navigate = useNavigate();
  return (
    <div class="outer-container">
      <section class="section-container">
        <div class="text-content">
          <h1>Bridging The Gap</h1>
          <p>
            Empowering individuals with disabilities with personalized education
            and career opportunities
          </p>
          <a href="/education" class="learn-more-button">
            Learn More
            <ChevronRightIcon />
          </a>
        </div>
        <div class="image-content">
          <img
            src={waitressimg}
            alt="Person smiling while holding a cup of coffee"
          />
        </div>
      </section>

      <section class="unlocking-potential-section">
        <div class="image-container">
          <img src={laptop} alt="Woman using laptop in a wheelchair" />
        </div>
        <div class="content-container">
          <h1>Unlocking Potential</h1>
          <div className="content-description">
            <h3>Jobs and Education for Every Ability</h3>
            <p>
              Our platform enables individuals with diverse abilities to develop
              their potential in careers and education. We believe every person
              brings unique value to society through inclusive opportunities
              that align with their talents, fostering growth, development, and
              independence for all.
            </p>
          </div>

          <div class="buttons-container">
            <button class="btn" onClick={() => navigate("/jobs")}>
              Explore Job Opportunities
            </button>
          </div>
        </div>
      </section>

      <section class="unlocking-potential">
        <div class="statistics">
          <div class="stat">
            <h3>17.74 M</h3>
            <p>
              People with disabilities of working age in Indonesia face
              significant challenges in finding employment.
            </p>
          </div>
          <div class="stat">
            <h3>44%</h3>
            <p>Of people with disabilities participate in the labor force.</p>
          </div>
          <div class="stat">
            <h3>70%</h3>
            <p>
              Of individuals with disabilities in Indonesia do not receive
              appropriate education or training.
            </p>
          </div>
        </div>
      </section>

      <div class="outer-background">
        <div class="inner-background">
          <div class="background-testimonial">
            <section class="testimonial-section">
              <div class="testimonial">
                <div class="testimonial-content">
                  <p class="quote">
                    “ Effortless Access to Jobs and Education with AbleCareer
                  </p>
                  <p class="description">
                    I am truly thankful for this website. Thanks to it, I’ve
                    found it much easier to access educational information and
                    job opportunities as a person with disabilities.
                  </p>
                  <p class="author">
                    <span>David</span> <span id="job"> Customer Service</span>
                  </p>
                </div>
                <div class="testimonial-image">
                  <img src={david} alt="David" />
                </div>
              </div>

              <div class="testimonial">
                <div class="testimonial-image">
                  <img src={naya} alt="Naya" />
                </div>
                <div class="testimonial-content">
                  <p class="quote">
                    “ Effortless Access to Jobs and Education with AbleCareer
                  </p>
                  <p class="description">
                    Discovering this website has been a game-changer for me. It
                    has opened doors to educational resources and job prospects
                    that were previously inaccessible due to my disability. I am
                    incredibly grateful for this initiative.
                  </p>
                  <p class="author">
                    <span>Naya</span> <span id="job"> Woodworker </span>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div class="partner-section-wrapper">
        <section class="partner-section">
          <h2>PARTNER</h2>
          <p>Big Thanks to our following partners</p>
          <div class="partner-logos">
            <div class="partner-box">
              <img src={unicef} alt="UNICEF" />
            </div>
            <div class="partner-box">
              <img src={rakuten} alt="Rakuten" />
            </div>
            <div class="partner-box">
              <img src={kemnaker} alt="Kemnaker" />
            </div>
            <div class="partner-box">
              <img src={linkedin} alt="LinkedIn" />
            </div>
            <div class="partner-box">
              <img src={act} alt="ACT" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default home;
