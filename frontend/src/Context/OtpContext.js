import { useState , useContext , createContext } from 'react';

const OtpContext = createContext();

const OtpProvider = ({children}) =>{
    const [userOtp,setUserOtp] = useState({
        email:"",
        otp:""
    })

    return(
        <OtpContext.Provider value={[userOtp,setUserOtp]}>
            {children}
        </OtpContext.Provider>
    )
}

//custom hook
const useOtp = () =>useContext(OtpContext)

export {useOtp,OtpProvider}
