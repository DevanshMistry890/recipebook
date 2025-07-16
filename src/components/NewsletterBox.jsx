import React from 'react';
import '../assets/css/extra.css';

function NewsletterBox() {
    return (
        <div className="newsletter tstbite-components recipe-component bg-primary-light mt-5 rounded-6 py-5 px-4">
            <div className="text-center py-3">
                <h5 className="mb-3">Deliciousness to your inbox</h5>
                <p className="f-size-24 font-weight-regular">Enjoy weekly hand picked recipes and recommendations</p>
                <form className="input-group custom-input-group mt-4">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email Address"
                        aria-label="Email Address"
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
