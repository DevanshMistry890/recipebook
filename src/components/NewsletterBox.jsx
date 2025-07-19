import React, { useState } from 'react';
import '../assets/css/extra.css';

function NewsletterBox() {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email address is required.');
            setSubmitted(false);
        } else if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            setSubmitted(false);
        } else {
            setError('');
            setSubmitted(true);
            console.log("Submitted email:", email);
        }
    };

    return (
        <div className="newsletter tstbite-components recipe-component bg-primary-light mt-5 rounded-6 py-5 px-4" aria-labelledby="newsletter-heading">
            <div className="text-center py-3">
                <h5 className="mb-3">Deliciousness to your inbox</h5>
                <p className="f-size-24 font-weight-regular">Enjoy weekly hand picked recipes and recommendations</p>
                <form className="input-group custom-input-group mt-4" aria-describedby="newsletter-desc" onSubmit={handleSubmit} noValidate>
                    <input
                        type="email"
                        id="newsletter-email"
                        className="form-control"
                        placeholder="Email Address"
                        aria-label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={!!error}
                        aria-describedby={error ? 'email-error' : undefined}
                        required
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-primary"
                            type="submit"
                            aria-label="Join newsletter"
                        >
                            JOIN
                        </button>
                    </div>
                </form>
                {error && (
                    <div
                        id="email-error"
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
                <small className="d-block mt-2">
                    By joining our newsletter you agree to our{' '}
                    <a href="#0" className="text-black d-block d-sm-inline-block">
                        <u className="tstbite-underline">Terms and Conditions</u>
                    </a>
                </small>
            </div>
        </div>
    );
}

export default NewsletterBox;
