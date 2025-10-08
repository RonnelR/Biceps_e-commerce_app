import React from 'react'
import Layout from '../Components/Layouts/Layout'
import { Link } from 'react-router-dom'
import useCategory from '../Hooks/useCategory'


const Categories = () => {
  const Categories = useCategory();

  return (
    <Layout title={"All Products - Biceps"}>
<div className='container'>

<div className='text-center'>
<h2 className='pnf-title mt-3'>All Products</h2>
<div className='row conatiner'>
{Categories?.map((c)=>(
  <div className='col-md-4 mt-5'>
  <div className='card'>
  <Link className='btn cat-btn' to={`/Categories-products/${c.slug}`}
    key={c._id}>
{c.name}
  </Link>
  </div>

  </div>
))}
</div>
</div>
    </div>


    


</Layout>
  )
}

export default Categories