import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-auto">
      <div className="container text-center">
        <small>
          Created by Abel George Stanley &nbsp; | &nbsp;
          <a
            href="https://www.linkedin.com/in/abel-george-stanley"
            target="_blank"
            rel="noopener noreferrer"
            className="text-info text-decoration-none"
          >
            LinkedIn
          </a>
          &nbsp; | &nbsp;
          <a
            href="https://github.com/abelgeostan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-info text-decoration-none"
          >
            GitHub
          </a>
        </small>
      </div>
    </footer>
  );
};

export default Footer;
