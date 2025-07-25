import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import authService from '../../services/authService';
import googleIcon from '../../assets/googlelogotr.png';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError]     = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpDisabled, setIsOtpDisabled] = useState(false);
  const [otpButtonText, setOtpButtonText] = useState('Get OTP');

  const navigate = useNavigate();

  const GOOGLE_AUTH_URL = `${import.meta.env.VITE_APP_API_URL}/oauth2/authorization/google`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await authService.register(username, email, password, otp);
      navigate('/dashboard');
    } catch (err) {
      console.error("Registration error:", err);
      setError('Registration failed. Please try again.');
    }
  };
  const handleGetOtp = async () => {
    if (!email) {
      setError('Please enter your email first.');
      return;
    }

    try {
      setIsOtpDisabled(true);
      setOtpButtonText('Resend in 40s');

      // Call your backend generate-otp endpoint
      await authService.generateOtp(email);

      // Countdown logic
      let seconds = 40;
      const interval = setInterval(() => {
        seconds -= 1;
        if (seconds > 0) {
          setOtpButtonText(`Resend in ${seconds}s`);
        } else {
          clearInterval(interval);
          setIsOtpDisabled(false);
          setOtpButtonText('Get OTP');
        }
      }, 1000);
    } catch (err) {
      console.error('OTP error:', err);
      setError('Failed to send OTP. Try again.');
      setIsOtpDisabled(false);
      setOtpButtonText('Get OTP');
    }
  };


  return (
    <Container fluid className="bg-dark d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow p-4 w-100 text-white border-primary bg-dark" style={{ maxWidth: '450px' }}>
        <h3 className="text-center mb-4">Sign Up</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
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

          <Form.Group className="mb-3" controlId="password">
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

          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup>
              <Form.Control
                className='bg-dark text-white'
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <Button
                variant="outline-primary"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <span role="img" aria-label="Hide">🙈</span>
                ) : (
                  <span role="img" aria-label="Show">👁️</span>
                )}
              </Button>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="otp">
            <Form.Label>OTP</Form.Label>
            <InputGroup>
              <Form.Control
                className="bg-dark text-white"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                variant="outline-success"
                onClick={handleGetOtp}
                disabled={isOtpDisabled}
              >
                {otpButtonText}
              </Button>
            </InputGroup>
          </Form.Group>

          <button onClick={handleSubmit} type="button" className="btn btn-outline-primary text-white w-100">Sign Up</button>


          <div className="mb-3 text-end">
            <span className="text-white">Already have an account? </span>
            <Link to="/login" className="text-primary">Log in</Link>
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
            Sign in with Google
          </button>

          
        </Form>
      </Card>
    </Container>
  );
};

export default Register;
