import React ,{useState, useEffect} from 'react'
import Layout from '../../Components/Layouts/Layout'
import AdminMenu from '../../Components/Layouts/AdminMenu'
import axios from 'axios'
import toast from 'react-hot-toast'
import CategoryForm from '../../Components/Layouts/Forms/CategoryForm'
import { Modal } from 'antd';

const  CreateCategories = () => {

  const [categories , setCategories] =  useState([]);
  const [name,setName] = useState(); 
  //update-category modal
  const [updatedName,setUpdatedName] = useState();
  const [selected,setSelected] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //update-category
  const handleUpdate= async(e)=>{
      try {
        e.preventDefault()
    const res = await axios.put(`/api/v1/category/update-category/${selected._id}`,{name:updatedName})
        if(res.data?.success){
          toast.success(res.data?.message)
          getAllCat();
        }
      } catch (error) {
        console.log(error)
        toast.error(res?.data?.message)
      }
  }
 

  //get-all category
  const getAllCat = async()=>{
    try {
      const res = await axios.get('/api/v1/category/all-category')
      if(res.data?.success){
          setCategories(res.data.allCategory);
      }
    } catch (error) {
      console.log(error)
      toast.error(res.data?.message)
    }
  }

  useEffect(() => {
      getAllCat()
  }, []);
  
  //create category
const handleSubmit= async(e)=>{
     
      try {
        e.preventDefault()
            const res = await axios.post('/api/v1/category/create-category',{name})
            if(res.data?.success){
              toast.success(`${name} ${res.data?.message}`)
              setName("")
              getAllCat()
            }
          } catch (error) {
            console.log(error)
            toast.error(res.data.message)
          }
}

//delete category
const handleDelete =async (id)=>{
      try {
        const res = await axios.delete(`/api/v1/category/delete-category/${id}`)
        if(res.data?.success){
          toast.success(res.data?.message)
          getAllCat()
        }
      } catch (error) {
        console.log(error)
        toast.error(res.data?.message)
      }
}

  return (

    <Layout title={'Manage Categories- Biceps'}> <div className='container-fluid m-3 p-3'>
    <div className='row'>
      <div className='col-3'>
        <AdminMenu/>
      </div>

      <div className='col-7 text-center'>
      <div >
      <div className='authBody text-center'>

      
            <h4 className='pnf-title text-center'>MANAGE CATEGORIES</h4>
        <CategoryForm value={name} setValue={setName} handleSubmit={handleSubmit} />
        <div >
        <table className="table">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody>
  
      {categories.map((c)=>(
        <tr key={c._id}>
        <td key={c._id}>{c.name}</td>
        <td > 

      <button className='btn btn-primary m-1' onClick={()=>{
          showModal();
          setUpdatedName(c.name)
          setSelected(c)
      }}>edit</button>

      <Modal title="Update Category" open={isModalOpen} footer={null} onCancel={handleCancel}  >
       <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate}/>
      </Modal>
    
      
      <button className='btn btn-danger' onClick={()=>{handleDelete(c._id)}}>delete</button>
       </td>
       </tr>
      ))}
     
   
  </tbody>
</table>
        </div>
    </div></div>
    </div>
    </div>
  </div></Layout>

  )}

export default CreateCategories
