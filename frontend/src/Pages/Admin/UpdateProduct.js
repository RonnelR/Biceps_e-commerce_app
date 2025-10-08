import React , {useState, useEffect} from 'react'
import Layout from '../../Components/Layouts/Layout'
import AdminMenu from '../../Components/Layouts/AdminMenu'
import { Select } from 'antd'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'

const { Option  } = Select;


const UpdateProduct = () => {
    const params =useParams()
    const navigate = useNavigate();
    const [categories,setCategories] = useState([]);
    const [name,setName] = useState("");
    const [description,setDescription] = useState("");
    const [quantity,setQuantity] = useState("");
    const [photo,setPhoto] = useState("");
    const [category,setCategory] = useState("");
    const [price,setPrice] = useState("");
    const [shipping,setShipping] = useState("");
    const [id, setId] = useState('');
    
    
    //get single product
    const singleProduct = async () =>{
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/single-product/${params.slug}`)
           if(res.data?.success){
            setName(res.data.singleProd.name);
            setDescription(res.data.singleProd.description);
            setQuantity(res.data.singleProd.quantity)
            setPrice(res.data.singleProd.price);
            setShipping(res.data.singleProd.shipping);
            setCategory(res.data.singleProd.category._id);
            setId(res.data.singleProd._id)
           }
         
        } catch (error) {
            console.log(error)
            toast.error("something went wrong")
        }
    }

    useEffect(()=>{
        singleProduct()
    },[])

    
    
    //get-all category
    const getAllCat = async()=>{
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/all-category`)
        if(res.data?.success){
            setCategories(res.data?.allCategory);
        }
      } catch (error) {
        console.log(error)
        toast.error(res.data?.message)
      }
    }
    
    useEffect(() => {
        getAllCat()
       
    }, []);
    
    //update - product
    const handleSubmit = async(e)=>{
      e.preventDefault();
      try {
        const productData = new FormData();
          productData.append("name", name);
          productData.append("description", description);
          productData.append("price", price);
          productData.append("quantity", quantity);
          photo && productData.append("photo", photo);
          category && productData.append("category", category);
          productData.append("shipping", shipping);
          const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/update-product/${id}`,
            productData
          );
        if(res.data?.success){
          console.log(" product updated successfully!");
          toast.success("successfully updated product");
          navigate('/dashboard/admin/Products')
        }
      } catch (error) { 
        console.log(error)
        toast.error("somethig went wrong")
      }
    }

    //delete product

    const handleDelete = async () => {
        try {
          let answer = window.prompt("Are You Sure want to delete this product ? ");
          if (!answer) return;
          const res = await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/delete-product/${id}`
          );
          toast.success("Product Deleted Succfully");
          navigate("/dashboard/admin/products");
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        }
      };
    
      return (
        <Layout>
          <div className='container-fluid m-3 p-3'>
            <div className='row'>
              <div className='col-3'>
                <AdminMenu/>
              </div>
    
              <div className='col-9'>
                <h1>Update Products</h1>
                <div>
                <form onSubmit={handleSubmit}>
                <div className='form-group w-75 '>
    
                    <Select className='col-md-12 mb-3' onChange={(value)=>{setCategory(value)}} id='categoryid' value={category} placeholder= "select category...">

                    {categories.map((c)=>( 
                      <Option name={c.name} value={c._id} key={c._id} >{c.name}
                      </Option>
                         ))} 
    
                    </Select>
                  <div className="mb-3">
                    <label className="btn btn-outline-secondary col-md-12">
                     
                      <input
                      id='photoid'
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        hidden
                      />
                       {photo ? photo.name : "Upload Photo"}
                    </label>
                  </div>
                  <div className="mb-3">
                    {photo ? (
                      <div className="text-center">
                        <img
                        id='imgId'
                        name={photo}
                          src={URL.createObjectURL(photo)}
                          alt="product_photo"
                          height={"200px"}
                          className="img img-responsive"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <img
                        id='imgapiid'
                        src={`/api/v1/product/product-photo/${id}`}
                          alt="product_photo"
                          height={"200px"}
                          className="img img-responsive"
                        />
                      </div>
                    ) }
                  </div>
                   <input type='text' className='form-control mb-3' id='nameId' value={name} onChange={(e)=>(setName(e.target.value))} placeholder='product name'/>
    
                   <textarea name='description' id='descriptionId' className='form-control mb-3' rows={4} value={description} onChange={(e)=>(setDescription(e.target.value))} placeholder='product description.....'/>
                   <input type='number' id='quantityId' name='quantity' className='form-control mb-3' value={quantity} onChange={(e)=>(setQuantity(e.target.value))} placeholder='product quantity'/>
                
                   <input type='number' id='priceid' name='price' className='form-control mb-3' value={price} onChange={(e)=>(setPrice(e.target.value))} placeholder='product price'/>
    
                   <Select placeholder='shipping' id='shippingid' onChange={(value)=>(setShipping(value))} value={shipping ? "YES" : "NO"} className='col-md-12'   >
                        <Option value={1}>YES</Option>
                        <Option value={0}>NO</Option>
    
                   </Select>
                   <div className='d-flex '>
                   <button  className='btn btn-primary m-3'  type='submit'>UPDATE PRODUCT</button>
                   </div>
                   
                   </div>
                   </form>
                   <button  className='btn btn-danger m-3' onClick={handleDelete} type='submit'>DELETE PRODUCT</button>
                </div>
              </div>
            </div>
            
          </div>
         
        </Layout>
  )
}

export default UpdateProduct