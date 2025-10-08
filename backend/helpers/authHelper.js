import bcrypt from "bcrypt";

/******************************* hashing password **********************************/
const saltRounds = 10;
export const hashpassword = async (password)=>{
    try {
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(error)
    }
}


/******************************* password comparing **********************************/
export const comparePassword = async (password,hashedPassword)=>{
    try {
        const comparedPassword =  await bcrypt.compare(password,hashedPassword)
        return comparedPassword;  
    } catch (error) {
        console.log(error)
    }
    
}