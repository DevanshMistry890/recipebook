import React, { useState } from 'react';

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      setError('Email address is required.');
      setSubmitted(false);
    } else if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address.');
      setSubmitted(false);
    } else {
      setError('');
      setSubmitted(true);
      console.log('Email submitted:', email);
      // Optionally clear input or send to backend
    }
  };

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
              <label htmlFor="newsletter-email" className="sr-only">
                Email Address
              </label>
              <input
                id="newsletter-email"
                type="email"
                className="form-control"
                placeholder="Email Address"
                aria-label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? 'newsletter-error' : undefined}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSubmit}
                  aria-label="Join newsletter"
                >
                  JOIN
                </button>
              </div>
            </div>

            {error && (
              <div
                id="newsletter-error"
                className="text-danger mt-2"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            {submitted && !error && (
              <div
                className="mt-2"
                role="status"
                aria-live="polite"
              >
                Thank you for subscribing!
              </div>
            )}

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