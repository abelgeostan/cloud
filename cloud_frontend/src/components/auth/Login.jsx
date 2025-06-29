import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import authService from '../../services/authService';
import googleIcon from '../../assets/googlelogotr.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const GOOGLE_AUTH_URL = `${import.meta.env.VITE_APP_API_URL}/oauth2/authorization/google`;
  // const GOOGLE_AUTH_URL = 'http://localhost:8080/oauth2/authorization/google';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      navigate('/');
    } catch (err) {
      console.error("Login attempt failed:", err);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <Container fluid className="bg-dark d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow p-4 w-100 text-white border-primary bg-dark" style={{ maxWidth: '450px' }}>
        <h3 className="text-center mb-4">Log In</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              className="bg-dark text-white"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                className='bg-dark text-white'
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <Button
                variant="outline-primary"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <span role="img" aria-label="Hide">🙈</span>
                ) : (
                  <span role="img" aria-label="Show">👁️</span>
                )}
              </Button>
            </InputGroup>
          </Form.Group>
          <div className="mb-3 text-end">
            <span className="text-white">No account? </span>
            <Link to="/register" className="text-primary">Sign up</Link>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            className="btn btn-outline-light w-100 mb-3 d-flex align-items-center justify-content-center"
            onClick={() => window.location.href = GOOGLE_AUTH_URL}
          >
            <img
              src={googleIcon}
              alt="Google"
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            Log in with Google
          </button>

          <button type="submit" className="btn btn-outline-primary w-100 text-white">Log In</button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
