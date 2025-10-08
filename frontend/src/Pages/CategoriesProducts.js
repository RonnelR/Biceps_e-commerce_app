import  Layout  from '../Components/Layouts/Layout'
import { useParams ,useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const CategoriesProducts = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [products,setProducts] = useState([]);
  const [category,setCategory] = useState();


const productsBasedOnCategory = async () =>{
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/products-category/${params.slug}`)
    if(res.data?.success){
      setProducts(res.data?.products)
      setCategory(res.data?.category)  
    }
    
  } catch (error) {
    console.log(error)
  }
}

useEffect(()=>{
  if(params?.slug){
    productsBasedOnCategory()
  }
},[params?.slug])

  return (
    <Layout>
      <div className='container'>
        <div className='row'>
          <div className='text-center'>
          <h4>Category - {category?.name}</h4>
          <h4>{products?.length} results found</h4>
          </div>
        </div>

<div className='row'>
  <div>

  

  <div className='d-flex flex-wrap'>
    {products.map((p)=>(
 <div className="card cardStyle m-3" key={p._id} style={{width: '15rem'}}>
  <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top " alt={p.name}/>
  <hr/>
  <div className="card-body text-center">
    <h6 className="card-title h6">{p.name}</h6>
    <h5 className="card-title h4 text-dark">₹{p.price}</h5>
    <p className="card-text h6 text-muted ">{p.description.length >20 ? p.description.substring(0,20)+"..." : p.description}</p>
    <div className='row container'>
    <div className='col-md-6 cbBlueBody'>
    <button className='cbBlue' onClick={()=>{navigate(`/product-details/${p.slug}`)}}>MORE</button>
    </div>
    <div className='col-md-6 mt-1 cbDarkBody'>
    <button className='cbDark'>CART</button>
     
    </div>
</div>
  </div>
</div>

    ))}

    
</div>

  
  </div>
</div>

      </div>
    </Layout>
  )
}

export default CategoriesProducts