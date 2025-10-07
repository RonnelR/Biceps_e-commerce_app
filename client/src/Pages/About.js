import React from 'react'
import Layout from '../Components/Layouts/Layout'

const About = () => {
  return (
    <Layout title={"About Us - Biceps"}>
  <>
  <div className='container'>
    <div className='row '>
      <div className='col-md-6 mt-5'>
      <img style={{width:"100%"}} src='https://images.pexels.com/photos/7693730/pexels-photo-7693730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' 
  alt='about_us'></img>
      </div>
      <div className='col-md-6  mt-5 text-justify fs-4'>
      <h1 className='text-center bg-info text-warning p-2'>About Us</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
      </div>
    </div>
  </div>
  </>
</Layout>
  )
}

export default About