import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import authService from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
            <Form.Control
              className="bg-dark text-white"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Form.Group>
          <div className="mb-3 text-end">
            <span className="text-white">No account? </span>
            <Link to="/register" className="text-primary">Sign up</Link>
          </div>

          <button type="submit" class="btn btn-outline-primary w-100 text-white">Sign Up</button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
