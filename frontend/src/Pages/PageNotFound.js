import React from 'react'
import Layout from '../Components/Layouts/Layout';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <Layout title={"page not found - Biceps"}>
    <div className='pnf'> 
      <h1 className='pnf-title'>404</h1>
      <p className='pnf-text'>Oops! Page is not found. </p>
      <Link to={"/"}>
      <button className='pnf-btn'>Go Back</button>
      </Link>
    </div>
    
   
   
</Layout>
  )
}

export default PageNotFound