import React, {useEffect, useState} from 'react'
import Layout from '../Components/Layouts/Layout'
import { useCart } from '../Context/CartContext'
import {useAuth} from '../Context/Auth'
import { Link, useNavigate } from 'react-router-dom'
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios'
import toast from 'react-hot-toast'
 
const Cart = () => {


const [cart, setCart] = useCart();
const [auth, setAuth] = useAuth();
const [clientToken, setClientToken] = useState('')
const [instance,setInstance] = useState('')
const [loading,setLoading] = useState(false)
const [quantity,setQuantity] = useState()


const navigate = useNavigate()

//total amount of products
const totalPrice = () =>{
  let total = 0;
 cart?.map((i)=>{
  total = total + i.price
 })
 return total;

}


//handleRemove
const handleRemove = (pid) =>{
    try {
     let myCart = [...cart];
     let index = myCart.findIndex((item)=>item._id == pid );
    myCart.splice(index,1)
     setCart(myCart)
     localStorage.setItem('cart',JSON.stringify(myCart))

    } catch (error) {
      console.log(error)
    }
}


//braintree token 
const braintreeToken = async () =>{
  const res = await axios.get('/api/v1/product/braintree/token')
  if(res?.data){
    setClientToken(res?.data?.clientToken)
  }
}

useEffect(()=>{
  braintreeToken()
},[auth?.token])


//handle Payment 
const handlePayment = async () =>{
  try {
    setLoading(true)
    const { nonce } = await instance.requestPaymentMethod();
    const {data} = await axios.post('/api/v1/product/braintree/payment',{nonce,cart})
    setLoading(false)
    
      setCart([]);
      localStorage.setItem('cart', '')
      navigate('/dashboard/user/Orders')
      toast.success('Payment Completed Successfull');
    
    
  } catch (error) {
    console.log(error)
  }

};

  return (
    <Layout title={"Cart items - Biceps"}>
    <div className='container'>
      <div className='row'>
        <div className='col-md-12 text-center mt-3'>   
        {auth?.user ? <h4 className='pnf-title text-center mt-3'>Hello {auth?.user.name}</h4> : ''}
          
          {auth?.token ? cart?.length < 1 ? 'No products in the cart' : <h6>{cart?.length} products in the cart</h6> : <h6>{cart.length}  products in the cart,<Link to={'/login'} > login</Link> to checkout</h6>} 
          
        </div>
      </div>
      <div className='row'>
      <div className='col-md-8 text-center mt-3'>
          <h5>Products</h5>
          <hr></hr>

{/* products card */}
{cart?.map((p)=>(
<form>
<div className='row card flex-row mt-2' key={p?._id}>
  <div className='col-md-8'>        
  <img src={`/api/v1/product/product-photo/${p?._id}`} className="card-img-top" alt={p.name}/>

</div>
  <div className='col-md-4 mt-5'>  
  <h6 className="card-title h6"> Name : {p.name}</h6>

    <h6 className="card-title h4 text-dark"> Price : ${p?.price }</h6>
    <p className="card-text h6 text-dark "> Description  : {p?.description?.length >20 ? p.description.substring(0,20)+"..." : p.description}</p>
  <button className='btn btn-danger' onClick={()=>{handleRemove(p._id)}}>REMOVE</button>
</div>
</div>   
</form>
 ))}

        </div>

      <div className='col-md-4 text-center mt-3'>
      <h3>Cart Summary</h3>
      <h5>Total | Payment | Checkout</h5>
      <hr></hr>
      {auth?.token ?  <><h5>Current Address</h5>
      <h6>{auth?.user?.address}</h6>
      </> : "" } 
      

      {cart.length < 1 ? "" :  <h5>Total - $ {totalPrice()} </h5>}


      {auth?.token ?  <Link to={'/dashboard/user/Profile'}>
          <button className='btn btn-warning'>UPDATE ADDRESS</button>
      </Link>   : cart?.length < 1 ? '' : <Link to={'/Login'}>
          <button className='btn btn-warning'>LOGIN FOR CHECKOUT</button>
      </Link> } 


      <hr/>
      <div className='mt-2'>
{clientToken &&  cart?.length && auth?.token  ? <>
  <DropIn
          options={{
            authorization:clientToken,
            paypal:{
              flow:'vault'
            }
          }}
          onInstance={instance=>setInstance(instance)}
          />
          
          <button className='btn btn-primary' onClick={handlePayment}>{ loading ? "Processing.." : "MAKE PAYMENT" }</button>
           
</> : ""}

      </div>
      </div>
      </div>

    </div>
    
</Layout>
  )
}

export default Cart