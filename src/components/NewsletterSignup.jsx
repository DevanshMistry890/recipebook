import React from 'react';

function NewsletterSignup() {
  return (
    <section className="tstbite-components bg-primary-light my-5 py-5">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-8 offset-xl-3 offset-lg-2 text-center py-4 py-md-5">
            <h2 className="mb-3 h1">Deliciousness to your inbox</h2>
            <p className="f-size-24 font-weight-regular">
              Enjoy weekly hand picked recipes <br /> and recommendations
            </p>
            <div className="input-group custom-input-group mt-4">
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                aria-label="Email Address"
              />
              <div className="input-group-append">
                <button className="btn btn-primary" type="button">
                  JOIN
                </button>
              </div>
            </div>
            <small className="mt-3 d-block">
              By joining our newsletter you agree to our{' '}
              <a href="#" className="text-black d-block d-sm-inline-block">
                <u className="tstbite-underline">Terms and Conditions</u>
              </a>
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSignup;
