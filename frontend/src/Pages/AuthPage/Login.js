import React, { useState } from 'react';
import {ToastContainer , toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link , useNavigate ,useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/Auth';
import Layout from '../../Components/Layouts/Layout';

const Login = () => {
  //useState
  const [email,setEmail] = useState('');
 const [password,setPassword] = useState('');
const [auth,setAuth] = useAuth();


//useNavigate and useLocation config
  const navigate = useNavigate();
  const location = useLocation();

  //function for submit
const loginSubmit = async (e)=>{

e.preventDefault();
try {
//axios
const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/login`,{email,password})

if(res && res.data.success){
toast.success(res.data && res.data.message);
setAuth({
  ...auth,
  user:res.data.user ,
  token:res.data.token
});
localStorage.setItem('auth',JSON.stringify(res.data))
 navigate( location.state || '/')
}else{
  toast.error(res.data.message)
}
} catch (error) {
  console.log(error)
  toast.error('something went wrong! Please check email or password!')
}
}

  return (
    <Layout title={"Login  - Biceps"}>
    <div className='regAndLog'>
    <div className='authBody'>
    <h4 className='pnf-title'> LOGIN</h4>
   <form onSubmit={loginSubmit} >
  <div className='m-2' >
    <input type="email" id='inputEmail' className="form-control" placeholder="Email" value={email}
    onChange={(e)=>{setEmail(e.target.value)}} required />
  </div>
  <div className='m-2'>
    <input type="password" id='inputPassword' className="form-control" value={password} onChange={(e)=>{setPassword(e.target.value)}}  placeholder="Password" required />
  </div>
  <Link to={'/ForgetPassword'} className='fpButton'>
    Forgot your password?
  </Link>
  <div  className="authButton m-2" >
  <button  className='loginButton' type="submit">Sign in</button>
  </div> 

  <Link to={'/Registration'} className='fpButton'>
    Are you new? Create an Account
  </Link>

</form>
</div>
    </div>
    <ToastContainer/>
</Layout>
  )
}

export default Login