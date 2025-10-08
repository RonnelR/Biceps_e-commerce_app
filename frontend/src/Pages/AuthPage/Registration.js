import React ,  { useState }from 'react'
import {Link ,  useNavigate  } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Layout from '../../Components/Layouts/Layout';


//useState
const Registration =  () => {
  const [name , setName] = useState('');
  const [address , setAddress] = useState('');
  const [phone , setPhone] = useState('');
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');

  
  //useNavigate config
  const navigate = useNavigate();

//registration submit function 
  const submitRegister = async (e)=>{
    e.preventDefault();
  
try {

//axios

  const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/register`,{name,email,password,phone,address})
  
  if (res && res.data.success) {
    toast.success( res.data && res.data.message);
    navigate("/login");
  }else{
    toast.error(res.data && res.data.message)
  }
} catch (error) {
  console.log( error)
  toast.error( 'something went wrong!')
}
  }
 
  return (

    <Layout title={"SignUp - Biceps"}>
    <div className='regAndLog'>
    <div className='authBody m-5'>
    <form className="  form-signin" onSubmit={submitRegister}>
  <h4 className="pnf-title">NEW USER</h4>
<div>
  <input type="name"
   value={name} 
   onChange={ (e)=>{setName(e.target.value)}} id="inputName" className="form-control " placeholder="Name" required  />

<input type="email"  value={email} onChange={ (e)=>{setEmail(e.target.value)}}  id="inputEmail" className="form-control mt-2" placeholder="Email" required />


<input type="password"  value={password} onChange={ (e)=>{setPassword(e.target.value)}}  id="inputPassword" className="form-control mt-2" placeholder="Password" required />

  <input type="address"  value={address} onChange={ (e)=>{setAddress(e.target.value)}}  
id="inputAddress" className="form-control mt-2" placeholder="Address" required />


  <input type="tel" pattern='[0-9]{10}' title='Invalid phone number!'  value={phone} onChange={ (e)=>{setPhone(e.target.value)}}  id="inputPhone" className="form-control mt-2" placeholder="Phone" required />

  </div>
  <div className='text-center'>
  <div  className="authButton mt-3 mb-2" >
  <button  className='loginButton' type="submit">CREATE AN ACCOUNT</button>
  </div> 
  <Link to={'/Login'} className='fpButton'>
    Already a user? Login
  </Link>
  </div>
  
</form>
</div>
</div>
</Layout>
  )
}

export default Registration