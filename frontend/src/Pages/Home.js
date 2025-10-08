import React ,{ useState,useEffect} from 'react'
import Layout from '../Components/Layouts/Layout';
import { Checkbox, Radio,  } from 'antd';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate , Link} from 'react-router-dom';
import { Prices } from '../Components/Layouts/Prices';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/Auth';
import CarouselPage from '../Components/Layouts/CarouselPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'



const Home = () => {
  
const navigate = useNavigate();
const [wishlistItems,setWishlistItems] = useState([])
const [category,setCategory] = useState([]);
const [product,setProduct] = useState([]);
const [checked,setChecked] = useState([]);
const [radio,setRadio] = useState([]);
const [total,setTotal] = useState(0)
const [page,setPage] = useState(1);
const [loading,setLoading] = useState(false)
const [cart,setCart] = useCart();
const [auth,setAuth] = useAuth({})

//get-all category
const getAllCat = async()=>{
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/all-category`)
    if(res.data?.success){
        setCategory(res.data.allCategory);
    }
  } catch (error) {
    console.log(error)
    toast.error(res.data?.message)
  }
}

useEffect(() => {
  totalProductCount()
    getAllCat()
}, []);

//get initial products
const getInitialProduct = async()=>{

  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-list/${page}`)
    if(res.data?.success){
      setProduct(res.data?.product)
    }
  }catch (error) {
    console.log(error)
  }
}

//lifecycle method
useEffect(()=>{
  if(!checked.length || !radio.length){
    getInitialProduct();

  }
},[checked.length,radio.length])


//handleFilter for filtering cat
const handleFilter = (value,id)=>{
  let all = [...checked]
  
  if(value){
    all.push(id)
  }else{
    all = all.filter((c) =>(c!== id))
  }
  setChecked(all)
}
  

//filter product

const filterProducts = async ()=>{
  try {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/v1/product/product-filter`,{checked,radio});
    if(res.data?.success){
      setProduct(res.data?.product)
    }
  } catch (error) {
      console.log(error),
      toast.error('something went wrong!')
  }
}

useEffect(()=>{
  if(checked.length || radio.length ){
  filterProducts()
  }
},[checked,radio])


//product total count
const totalProductCount = async () =>{
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-count`)
        if(res.data){
          setTotal(res.data?.total)
        }

      } catch (error) {
        console.log(error)
      }
}

//loading function
const IfLoading = async () =>{
  try {
    setLoading(true)
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-list/${page}`);
    setLoading(false)
    if(res.data?.success){
      setProduct([...product,...res.data?.product])
    }
  } catch (error) {
    console.log(error)
    setLoading(false)
  }
}

useEffect(()=>{
  if(page === 1)return;
    IfLoading()
},[page])


//handleCart
const handleCart = (p) =>{
  try {
    setCart([...cart,p])
    localStorage.setItem('cart',JSON.stringify([...cart,p]))
    toast.success('Product added to the cart!')
  } catch (error) {
    console.log(error)
    
  }
}

//handle wish

const handleWish = async(pid)=>{
try {
  const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/wishlist/add-Products`,{pid})
if(res?.data){
getWishlist()
  toast(res?.data.message)
}
} catch (error) {
  console.log(error)
}
}

//getWishlist
const getWishlist =async () =>{
  try {
    const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/wishlist/get-List`)
    if(data && data.items && data.items.length > 0){
      setWishlistItems(data.items[0].wishlistItems)
    }

  } catch (error) {
    error
  }
}

useEffect(()=>{
  getWishlist()
},[auth?.token])

  return (
    <Layout title={"Shop now - Biceps"}>
     {/* carousel component */}

<CarouselPage/>
    <div className='container-fluid'>
    <div className='row'>

    {/* filter by category */}
    <div className='col-md-3'><h4 className='m-3 p-2'>Filter by Category</h4>
    <hr/>
    <div className='d-flex flex-column'  >
    {category.map((c)=>(
       
      <Checkbox key={c._id} onChange={(e)=>(handleFilter(e.target.checked,c._id))} name={c.name}  >
      {c.name}
      </Checkbox>
      
    ))}
    </div>

{/* filter by price */}
    <div className='d-flex flex-column mt-5'>
    <h4 className='m-3 p-2'>Filter by Price</h4>
    <hr/>

   <Radio.Group className='d-flex flex-column' name='radiogroup' onChange={(e)=>(setRadio(e.target.value))}>

    {Prices.map((p)=>(
      <div key={p._id}>
      <Radio name={p.name}  value={p.array} >{p.name}</Radio>
      </div>

    ))}
    </Radio.Group>

    </div>
  <button className='btn btn-danger m-5' onClick={()=>(window.location.reload())}>RESET FILTERS</button>
    </div>

<div className='col-md-9 '>
   
<h2 className='pnf-title text-center'> All Products</h2>


    <div className='d-flex flex-wrap'>
    {product.map((p)=>(
 <div className="card m-3 text-center cardStyle" key={p._id} style={{width: '15rem'}}>
  <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top mt-3 " alt={p.name}/>

{/* heart feature for wishlist */}
{auth?.token && <button className='wishlistButton' onClick={() =>handleWish(p._id)} >
{wishlistItems.some(item => item._id === p._id) ? (
   <FontAwesomeIcon icon={faHeart} size="2xs" style={{ color: "#ff051e" }} />
) : (

  <FontAwesomeIcon icon={faHeart} size="2xs"  />
)}

</button> }

      

  <hr/>
  <div className="card-body">
    <h6 className="card-title h6">{p.name}</h6>
    <h5 className="card-title h4 text-dark">${p.price}</h5>
    <p className="card-text h6 text-muted ">{p.description.length >20 ? p.description.substring(0,20)+"..." : p.description}</p>

    <div className='row container'>
   
    <div className='col-md-6 cbBlueBody'>
    <button className='cbBlue' onClick={()=>{navigate(`/product-details/${p.slug}`)}}>MORE</button>
    </div>
    <div className='col-md-6 cbDarkBody mt-1'>
    <button className='cbDark' onClick={() =>{handleCart(p)}} >CART</button>
     
    </div>
</div>
  </div>
</div>

    ))}

    
</div>
<div className='m-3 text-center'>
{
 checked.length < 1 && radio.length < 1 ? <>
      {product && product.length < total && <button className='lmButton' onClick={(e)=>{
        e.preventDefault
        setPage(page + 1);
      
      }}>{loading ?  <h4>loading...</h4> : <h4>Load More...</h4>}</button> }
      
  </> : ""
}
 
 

    </div>
    </div>
    </div>
    </div>
    </Layout>
  )
}

export default Home