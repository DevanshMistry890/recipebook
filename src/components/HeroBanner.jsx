import React from 'react';
import bannerImage from '../assets/images/home_banner.jpeg';

function HeroBanner() {
  return (
    <div className="card rounded-16 overflow-hidden border-0 bg-secondary mt-0 mt-md-4">
      <div className="row g-0">
        <div className="col-lg-7">
          <img src={bannerImage} className="w-100" alt="Mighty Super Cheesecake" />
        </div>
        <div className="col-lg-5">
          <div className="p-4 p-md-5 d-flex flex-column justify-content-center h-100 position-relative">
            <strong className="d-flex align-items-center">
              <svg
                data-name="feather-icon/trending-up"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
              >
                <rect width="20" height="20" fill="rgba(255,255,255,0)" />
                <path
                  d="M.244,11.423a.834.834,0,0,1,0-1.178L6.494,3.994a.834.834,0,0,1,1.178,0L11.25,7.571l5.9-5.9H14.167a.833.833,0,1,1,0-1.667h5A.833.833,0,0,1,20,.833v5a.834.834,0,0,1-1.667,0V2.845L11.839,9.339a.834.834,0,0,1-1.179,0L7.083,5.761l-5.66,5.661a.834.834,0,0,1-1.179,0Z"
                  transform="translate(0 4.167)"
                  fill="#ff642f"
                />
              </svg>
              <span className="ms-2 caption font-weight-medium">85% would make this again</span>
            </strong>
            <h4 className="my-3">Mighty Super Cheesecake</h4>
            <p className="big pe-0 pe-md-5 pb-3 pb-sm-5 pb-lg-0">
              Look no further for a creamy and ultra smooth classic cheesecake recipe! No one can deny its simple decadence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
