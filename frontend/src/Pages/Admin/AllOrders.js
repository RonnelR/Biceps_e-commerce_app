import React , {useState, useEffect} from 'react'
import Layout from '../../Components/Layouts/Layout'
import axios from 'axios'
import { useAuth } from '../../Context/Auth'
import moment from 'moment'
import AdminMenu from '../../Components/Layouts/AdminMenu'
import { Select } from "antd";
const { Option } = Select;

const AllOrders = () => {

const [allOrders,setAllOrders] = useState([])
const [status,setStatus] = useState(["Not Processing","Processing","Shipped","Delivered","Cancel"])
const [auth,setAuth] = useAuth({})

  const getAllOrderLists = async() =>{
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/all-orders`)
      setAllOrders(data)
    } catch (error){
      console.log(error)
    }
}

useEffect(()=>{
    getAllOrderLists()
},[auth?.token])

const handleChange = async(orderId,value) =>{
             
    try {
        const {data} = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/update-orders/${orderId}`,{status:value})
        getAllOrderLists()
        
    } catch (error) {
        console.log(error)
    }
}

  return (
    <Layout title={'All Orders - Biceps'}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-3'>
            <AdminMenu/>
          </div>

          <div className='col-8'>
          <div className='text-center authBody'>
            

            {allOrders?.length < 1 ? <h4 className='pnf-title text-center mt-3'>NO ORDERS</h4> : <>
            <h4 className='pnf-title text-center mt-3'>ALL ORDERS</h4>
            {allOrders?.map((o, i) => {
              return (
                <div className="border shadow">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col"><h4>#</h4></th>
                        <th scope="col"><h4>status</h4></th>
                        <th scope="col"><h4>buyers</h4></th>
                        <th scope="col"> <h4>date</h4></th>
                        <th scope="col"><h4>Payment</h4></th>
                        <th scope="col"><h4>Quantity</h4></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><h6>{i + 1}</h6></td>
                        <td>
                        <Select variant={false}
                        onChange={(value) => handleChange(o._id, value)}
                          defaultValue={o?.status}
                         >
                        {status.map((s, i) =>(
                                <Option key={i} value={s}>
                              {s}
                            </Option>
              ))}
                           
                        </Select>
                        </td>
                        <td><h6>{o?.buyers?.name}</h6></td>
                        <td><h6>{moment(o?.createAt).fromNow()}</h6></td>
                        <td><h6>{o?.payment.success ? "Success" : "Failed"}</h6></td>
                        <td><h6>{o?.products?.length}</h6></td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container mt-0">
                    {o?.products?.map((p, i) => (
                      <div className="row mb-2 p-3 card flex-row" key={p._id}>
                        <div className="col-md-4">
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p.name}
                            width="50px"
                            height={"50px"}
                          />
                        </div>
                        <div className="col-md-8">
                          <h6>Name : {p.name}</h6>
                          <h6>Description : {p.description.substring(0, 30)}</h6>
                          <h6>Price : {p.price}</h6>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            </> }


          </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AllOrders