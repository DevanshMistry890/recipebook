import React from 'react';
import logo from '../assets/logo.png'; // Adjust path based on your structure

function Footer() {
  return (
    <footer className="tstbite-footer pt-3 pt-md-5 mt-5 bg-lightest-gray">
      <div className="container">
        <div className="row pt-4 pb-0 pb-md-5">
          <div className="col-md-6">
            <div className="tastebite-footer-contnet pe-0 pe-lg-5 me-0 me-md-5">
              <a href="/">
                <img src={logo} alt="Recipe Book Logo" height={50} />
              </a>
              <p className="mt-3 text-gray-300 pe-0 pe-lg-5 me-0 me-lg-4">
                "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment"
              </p>
            </div>
          </div>
          <div className="col-md-2">
            <h6 className="caption font-weight-medium mb-2 inter-font">
              Tastebite
            </h6>
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Feedback</a></li>
            </ul>
          </div>
          <div className="col-md-2">
            <h6 className="caption font-weight-medium mb-2 inter-font">
              Legal
            </h6>
            <ul>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Conditions</a></li>
              <li><a href="#">Cookies</a></li>
              <li><a href="#">Copyright</a></li>
            </ul>
          </div>
          <div className="col-md-2">
            <h6 className="caption font-weight-medium mb-2 inter-font">
              Follow
            </h6>
            <ul>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Youtube</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container">
        <hr />
        <div className="row pb-4 pt-2 align-items-center">
          <div className="col-md-6 order-2 order-md-0">
            <p className="text-gray-300 small text-start mb-0">
              &copy; 2025 Recipe Book - All rights reserved
            </p>
          </div>
          <div className="col-md-6">
            <div className="tstbite-social text-start text-md-end my-4 my-md-0">
              <a href="#0"><i className="fab fa-facebook-f" /></a>
              <a href="#0"><i className="fab fa-instagram" /></a>
              <a href="#0"><i className="fab fa-twitter" /></a>
              <a href="#0"><i className="fab fa-youtube" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;