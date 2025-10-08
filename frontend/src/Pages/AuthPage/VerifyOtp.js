import React , {useState , useEffect} from 'react'
import Layout from '../../Components/Layouts/Layout'
import {useOtp} from '../../Context/OtpContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'



const VerifyOtp = () => {
 //useState
 const [otp,setOTP] = useState('');
 const [count,setCount] = useState(30)
const [userOtp,setUserOtp] = useOtp();

 //useNavigate config
   const navigate = useNavigate();

   //function for generate OTP
 const verifyOtp = async (e)=>{
 
 e.preventDefault();
 try {
  if(otp === userOtp.otp){
    console.log("otp verification success")
    toast.success('otp verification success');
    navigate('/NewPassword')
   
  }else{
    console.log("Invalid otp")
    toast.error('Invalid otp');
    
  }
 } catch (error) {
  console.log(error)
 }

 }

 //setintervel 
 useEffect(()=>{
 const interval = setInterval(()=>{
  setCount((prevValue)=> --prevValue)
 },1000);

 return () =>{
  clearInterval(interval);
  count === 0 && navigate('/ForgetPassword') 
 }

 },[count])
 
   return (
     <Layout title={"Verify-otp - Biceps"}>
     <div className='regAndLog'>
     <div className='authBody'>
     <h4 className='pnf-title'>VERIFY OTP</h4>
     <p>Resend OTP in 0:{count}</p>
     
    <form onSubmit={verifyOtp}>
   <div  >
     <input type="otp" id='inputOtp' className="form-control" placeholder="Enter otp" value={otp}
     onChange={(e)=>{setOTP(e.target.value)}} required />
   </div>

  
   <div  className="authButton mt-2" >
   <button  className='loginButton' type="submit">Verify OTP</button>
   </div> 
 </form>
 </div>
     </div>
 
 </Layout>
   )
}

export default VerifyOtp