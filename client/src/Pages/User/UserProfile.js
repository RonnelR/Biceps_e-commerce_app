import React , {useEffect, useState} from 'react';
import Layout from '../../Components/Layouts/Layout';
import UserMenu from '../../Components/Layouts/UserMenu';
import { useAuth } from '../../Context/Auth';
import toast from 'react-hot-toast';
import axios from 'axios'


const UserProfile = () => {

  //context
  const [auth , setAuth] = useAuth();


  //state 
  const [name , setName] = useState('');
  const [address , setAddress] = useState('');
  const [phone , setPhone] = useState('');
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');



  useEffect(()=>{
        const {name,email,address,phone} = auth?.user

        setName(name)
        setEmail(email)
        setAddress(address)
        setPhone(phone)
  },[auth?.user])

//handle update function 
  const handleUpdate = async (e)=>{
  e.preventDefault()
try {

//axios

 const res = await axios.put('/api/v1/auth/profile',{name,email,password,phone,address})

  if (res?.data.error) { 
    toast.error('error in profile updation')
  }else{
    setAuth({...auth,user: res?.data.updatedUser});
    let ls = localStorage.getItem('auth')
     ls = JSON.parse(ls)
     ls.user = res?.data.updatedUser;
      localStorage.setItem( 'auth' , JSON.stringify(ls))
    
    toast.success( 'user updated successfull');
  }
} catch (error) {
  console.log( error)
  toast.error( 'something went wrong!')
}


  }

  return (
    <Layout title={'Profile - Biceps'}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-3'>
            <UserMenu/>
          </div>

          <div className='col-7'>
          <div className='text-center regAndLog '>
<div className='authBody'>
<h4 className='pnf-title'>PROFILE</h4>

            <form onSubmit={handleUpdate}
             className="  form-signin" >
           
<div>
  <input type="name"
   value={name} 
   onChange={ (e)=>{setName(e.target.value)}} id="inputName" className="form-control " placeholder="Name"   />

<input type="email"  value={email} onChange={ (e)=>{setEmail(e.target.value)}}  id="inputEmail" className="form-control mt-2" placeholder="Email" disabled />


<input type="password"  value={password} onChange={ (e)=>{setPassword(e.target.value)}}  id="inputPassword" className="form-control mt-2" placeholder="Password"  />

  <input type="tel" pattern='[0-9]{10}' title='Invalid Password'  value={phone} onChange={ (e)=>{setPhone(e.target.value)}}  id="inputPhone" className="form-control mt-2" placeholder="Phone"  />

  <input type="address"  value={address} onChange={ (e)=>{setAddress(e.target.value)}}  
id="inputAddress" className="form-control mt-2" placeholder="Address"  />

  </div>
  <div className='authButton mt-2'>
  <button className="loginButton" type="submit">UPDATE</button>
  </div>
</form>
</div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default UserProfile