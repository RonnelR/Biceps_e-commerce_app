import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Spinner = () => {
  const [time, setTime] = useState(3);
  const navigate = useNavigate();
  const location = useLocation(); // fixed typo

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/login', { state: location.pathname });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, location]);

  return (
    <div className='d-flex min-vh-100 flex-column align-items-center justify-content-center'>
      <span className="sr-only">Redirecting to login in {time}...</span>
      <div className="spinner-grow text-info" role="status"></div>
    </div>
  );
};

export default Spinner;
