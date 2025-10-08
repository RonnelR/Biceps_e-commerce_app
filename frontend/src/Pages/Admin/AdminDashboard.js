import React from 'react'
import Layout from '../../Components/Layouts/Layout';
import { useAuth } from '../../Context/Auth';
import AdminMenu from '../../Components/Layouts/AdminMenu';


const AdminDashboard = () => {

    const [auth,setAuth] = useAuth();

  return (
    <Layout title = {"Admin Dashboard - Biceps"}>
    
    <div className='container-fluid m-3 p-3'>
    <div className='row'>
    <div className='col-3'>
      <AdminMenu/>


    </div>
    <div className='col-md-5'>
    <div className='card authBody text-center'>
      <h1>{auth.user.name}</h1>
      <p>{auth.user.email}</p>
      <p>{auth.user.phone}</p>
      <p>{auth.user.address}</p>
      </div>
    </div>
    </div>
       
    </div>
  
   
    </Layout>
  )
}

export default AdminDashboard;