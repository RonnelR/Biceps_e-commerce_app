import { useState ,useEffect } from "react";
import axios from 'axios'

export default function useCategory () {

    const [categories,setCategories] = useState([])

    //get cat

    const getCat = async() =>{

        try {
            const res =  await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/all-category`)
            if(res.data?.success){
                setCategories(res.data?.allCategory)
            }
        } catch (error) {
            console.log(error)
        }
      
    }

    useEffect(()=>{
        getCat()
        //eslint-disable-next-line
    },[])

    return categories;

}