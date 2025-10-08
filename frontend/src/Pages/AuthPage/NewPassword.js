import  Layout  from '../../Components/Layouts/Layout'
import React , {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import {useOtp} from '../../Context/OtpContext'

const NewPassword = () => {
   
    //glogal state
    const [userOtp,setUserOtp] = useOtp()
  const [newPassword,setNewPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('')


//useNavigate config
  const navigate = useNavigate();

  //function for generate OTP
const newPasswordChange = async (e)=>{
e.preventDefault()
try {

    if(newPassword !== confirmPassword){
toast.error("Password doesnt match");
    }
const {email} = userOtp
//axios
const res =await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/new-password`, {email , newPassword ,confirmPassword})

if(res && res.data.success){
toast.success(res.data && res.data.message);


 navigate('/Login')
}else{
  toast.error(res.data.message)
}
} catch (error) {
  console.log(error)
  toast.error('something went wrong!!')
}
}
    return(
        <Layout title={'New Password - Biceps'}>
             <div className='regAndLog'>
    <div className='authBody'>
    <h4 className='pnf-title'>NEW PASSWORD</h4>
   <form onSubmit={newPasswordChange}>
  

  <div className='mt-2'>
    <input type="password" id='inputNewPassword' className="form-control" value={newPassword} onChange={(e)=>{setNewPassword(e.target.value)}}  placeholder="New Password" required />
  </div>

  <div className='mt-2'>
    <input type="password" id='inputConfirmPassword' className="form-control" value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}  placeholder="Confirm Password" required />
  </div>
 
  <div  className="authButton mt-2" >
  <button  className='loginButton' type="submit">UPDATE PASSWORD</button>
  </div> 
</form>
</div>
    </div>
        </Layout>
    )

}

export default NewPassword