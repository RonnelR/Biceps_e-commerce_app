import Layout from '../Components/Layouts/Layout';
import React from 'react'
import { useSearch } from '../Context/SearchContext';
import { useNavigate } from 'react-router-dom';


const SearchInput = () => {
  const navigate = useNavigate()
  const [values,setValues] = useSearch()
    return (
    <Layout title={'Available Products - Biceps'}>
    <div className='container'>
      <div className='text-center'>
        <h4 className='pnf-title mt-3'>Searched Products</h4>
        <h5>{values?.results.length < 1 ? 'No Products were found' : `${values?.results.length} products found`}</h5>
        </div>

{/* product card  */}
        <div className='d-flex flex-wrap'>
      
    {values?.results.map((p)=>(
 <div className="card cardStyle m-3" key={p._id} style={{width: '15rem'}}>
  <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top " alt={p.name}/>
  <hr/>
  <div className="card-body">
    <h6 className="card-title h6">{p.name}</h6>
    <h5 className="card-title h4 text-dark">${p.price}</h5>
    <p className="card-text h6 text-muted ">{p.description.length >20 ? p.description.substring(0,20)+"..." : p.description}</p>
    <div className='d-flex'>
    <div>
    <button className='btn btn-primary' onClick={()=>{navigate(`/product-details/${p.slug}`)}}>More</button>
    </div>
    <div>
    <button className='btn btn-secondary m-2'>Cart</button>
     
    </div>
</div>
  </div>
</div>

    ))}
</div>
      </div>
  
    </Layout>
  )
}

export default SearchInput