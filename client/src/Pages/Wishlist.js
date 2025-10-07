import Layout from '../Components/Layouts/Layout'
import React , {useEffect, useState} from 'react'
import axios from 'axios'
import { useAuth } from '../Context/Auth'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'

function Wishlist() {

  //config useNavigate
  const navigate = useNavigate()

  const [auth,setAuth] = useAuth({})
  const [wishlistItems,setWishlistItems] = useState([])

  useEffect(()=>{
   getWishlist()
  },[auth?.token])

  const getWishlist =async () =>{
    try {
      const {data} = await axios.get('/api/v1/product/wishlist/get-List')
      if(data && data.items && data.items.length > 0){
        setWishlistItems(data.items[0].wishlistItems)
      }

    } catch (error) {
     error
    }
  }

  //handle remove
  const handleRemove = async (pid) => {
    try {
      const {data} = await axios.put('/api/v1/product/wishlist/remove-Products',{pid})
      if(data){
        toast.error(data.message)
        getWishlist()
      }

    } catch (error) {
      toast.error('Error in get Wishlist')
    }
  }
 
  return (
    <Layout>
    <>

    <div className=' container mt-3'>
    <div className='row'>
    <div className='text-center authBody '>
    <h4 className='pnf-title mt-2 text-center'>WISHLIST</h4>
    {wishlistItems.length < 1 ?  <p>Wishlist is Empty </p> : ""}

    
  <div className='text-center m-5 '>
   {wishlistItems?.map((p)=>(
     <div className=' authBody row card flex-row mt-3' key={p?._id}>
       <div className='col-md-8 ' style={{width:'15rem'}}>        
        <img src={`/api/v1/product/product-photo/${p?._id}`} className="card-img-top" alt={p?.name}/> 
     </div>
    
       <div className='col-md-4 mt-5'>  
     <h6 className="card-title h6"> Name : {p?.name}</h6>
         <h6 className="card-title h4 text-dark"> Price : ${p?.price}</h6>
         <p className="card-text h6 text-dark "> Description : {p?.description?.length >20 ? p.description.substring(0,20)+"..." : p.description}</p>

         <div className='m-1'>
       <button className='btn btn-danger' onClick={()=>{handleRemove(p._id)}}>REMOVE</button>
       </div>
       <div className='m-1'>
    <button className='btn btn-primary' onClick={()=>{navigate(`/product-details/${p.slug}`)}}>MORE</button>
    </div>
    </div>
     </div>   
   
      ))}

 

 </div>
    </div>
    </div>
     </div>
     
 
        </>
    </Layout>
  )
}

export default Wishlist