import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="d-flex vh-100 justify-content-center align-items-center bg-dark"
    >
      <Row className="text-center">
        <Col>
          <h1 className="text-primary mb-4">Welcome to STAN Drive!</h1>
          <Button
            onClick={() => navigate('/login')}
            className="btn btn-primary mx-2"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate('/register')}
            className="btn btn-primary mx-2"
          >
            Register
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
