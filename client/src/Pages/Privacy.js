import React from 'react'
import Layout from '../Components/Layouts/Layout'

const Privacy = () => {
  return (
    <Layout title={"Privacy - Biceps"}>
   <>
  <div className='container'>
    <div className='row '>
      <div className='col-md-6 mt-5'>
      <img style={{width:"100%"}} src='https://termshub.io/v3/assets/images/products/privacy_policy_hero.svg' 
  alt='about_us'></img>
      </div>
      <div className='col-md-6  mt-5 text-justify fs-4'>
      <h1 className='text-center bg-info text-warning p-2'>Privacy and Policies</h1>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      </div>
    </div>
  </div>
  </>
</Layout>
  )
}

export default Privacy