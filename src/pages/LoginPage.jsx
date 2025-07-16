import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Card, Alert } from 'react-bootstrap';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
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
              <h2 className="mb-2 h1">Welcome Back</h2>
              <p className="text-muted">Log in to continue your recipe journey</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleLogin}>
              <InputField
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                label="Password"
                placeholder="*********************"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="text-center mt-4 mb-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary px-4 py-2 w-100"
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </div>
            </Form>

            <p className="text-center mt-3">
              No account?{" "}
              <Link to="/signup">
                Sign up Here
              </Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}

export default LoginPage;