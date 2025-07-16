import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Card, Alert } from 'react-bootstrap';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error('Sign-up error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tstbite-components py-5 bg-lightest-gray d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Container style={{ maxWidth: '1200px' }}>
        <Card className="border-0 rounded-6 shadow-sm p-4 bg-white">
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="mb-2 h1">Create an Account</h2>
              <p className="text-muted">Join us and start your recipe journey</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSignUp}>
              <InputField
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                label="Password"
                placeholder="Create a password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputField
                label="Confirm Password"
                placeholder="Re-enter your password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="text-center mt-4 mb-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary px-4 py-2 w-100"
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </Form>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none">
                Log In Here
              </Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}

export default SignUpPage;