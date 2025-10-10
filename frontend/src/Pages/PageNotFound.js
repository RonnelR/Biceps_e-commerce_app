import React from 'react';
import Layout from '../Components/Layouts/Layout';
import { Link } from 'react-router-dom';
// import './PageNotFound.css'; // We'll create a separate CSS file for styles

const PageNotFound = () => {
  return (
    <Layout title="Page Not Found - Biceps">
      <div className="pnf-container">
        <div className="pnf-card">
          <h1 className="pnf-title">404</h1>
          <p className="pnf-text">Oops! The page you are looking for does not exist.</p>
          <Link to="/">
            <button className="pnf-btn">Go Back Home</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PageNotFound;
