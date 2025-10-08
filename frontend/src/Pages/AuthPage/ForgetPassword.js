import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layouts/Layout';
import {useOtp} from '../../Context/OtpContext'

const ForgetPassword = () => {
  //useState
  const [email,setEmail] = useState();
  const [userOtp,setUserOtp] = useOtp()

//useNavigate config
  const navigate = useNavigate();

  //function for generate OTP
const generateOtp = async (e)=>{

e.preventDefault();
try {
//axios
const res =await axios.post('/api/v1/auth/forget-password',{email})

if(res && res.data.success){
toast.success(res.data && res.data.message);

setUserOtp({
  email:email,
  otp:res?.data.otp
})

 navigate('/Verify-Otp')
}else{
  toast.error(res.data.message)
}
} catch (error) {
  console.log(error)
  toast.error('something went wrong!!')
}
}

  return (
    <Layout title={"ForgetPassword - Biceps"}>
    <div className='regAndLog'>
    <div className='authBody'>
    <h4 className='pnf-title'>FORGOT PASSWORD</h4>
   <form onSubmit={generateOtp}>
  <div  >
    <input type="email" id='inputEmail' className="form-control" placeholder="Email" value={email}
    onChange={(e)=>{setEmail(e.target.value)}} required />
  </div>
   
  <div  className="authButton mt-2" >
  <button  className='loginButton' type="submit">Generate Otp</button>
  </div> 
</form>
</div>
    </div>

</Layout>
  )
}

export default ForgetPassword;