import React from 'react'
import Layout from '../Components/Layouts/Layout';

const Contact = () => {
  return (
    <Layout title={"Contact Us - Biceps"}>
    <>
  <div className='container'>
    <div className='row '>
      <div className='col-md-6 mt-5'>
      <img style={{width:"100%"}} src='https://images.ctfassets.net/xj0skx6m69u2/6XtpFUVse6U43tKsCFlqK/716080a1a6e89a61c92968220f91155f/stockfresh_8245621_female-customer-services-agent-in-call-center_sizeS.jpg?fm=jpg&w=648&h=426&fit=fill&f=Right&q=85' 
  alt='contact_us'></img>
      </div>
      <div className='col-md-6  mt-5 text-justify fs-4'>
      <h1 className='text-center bg-info text-warning p-2'>Contact Us</h1>
     <p>📧 bicepssupport@gmail.com</p>
     <p>🌐 www.biceps.com</p>
     <p>📧 bicepssupport@gmail.com</p>

      </div>
    </div>
  </div>
  </>
</Layout>
  )
}

export default Contact