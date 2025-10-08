import React, { useState ,useEffect } from 'react'
import {useNavigate ,useLocation} from 'react-router-dom'

const Spinner = () => {

    const [time, setTime] = useState(3);
    const navigate = useNavigate();
    const localion = useLocation();

useEffect(() => {
    const interval =  setInterval(() => {
            setTime((prevValue)=> --prevValue);
            
        }, 1000);
    

  return () =>{ clearInterval(interval);
    time === 0 && navigate('/login'  ,{
      state:location.pathname
    })
  }
}, [time,navigate,location])

  return (
   <>
 
<div className='d-flex min-vh-100 flex-column align-items-center justify-content-center '>
<span className="sr-only ">Redirect to the login {time} </span>
<div className="spinner-grow text-info" role="status">
  
</div>
</div>

</>
  )
}

export default Spinner