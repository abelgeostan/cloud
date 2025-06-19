import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import authService from '../../services/authService';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(username, email, password);
      navigate('/login');
    } catch (err) {
      console.error("Registration error:", err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container fluid className="bg-dark d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow p-4 w-100 text-white border-primary bg-dark" style={{ maxWidth: '450px' }}>
        <h3 className="text-center mb-4">Sign Up</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              className='bg-dark text-white'
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              className='bg-dark text-white'
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              className='bg-dark text-white'
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </Form.Group>
          
          <div className="mb-3 text-end">
            <span className="text-white">Already have an account? </span>
            <Link to="/login" className="text-primary">Log in</Link>
          </div>
          
          
          <button onClick={handleSubmit} type="button" class="btn btn-outline-danger text-white w-100">Sign Up</button>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;
