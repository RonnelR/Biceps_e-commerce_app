import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layouts/Layout';
import axios from 'axios';
import { useAuth } from '../../Context/Auth';
import moment from 'moment';
import AdminMenu from '../../Components/Layouts/AdminMenu';
import { Select } from 'antd';
const { Option } = Select;

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [auth] = useAuth();
  const statusOptions = ["Not Processing", "Processing", "Shipped", "Delivered", "Cancel"];

  // Fetch all orders
  const getAllOrderLists = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/all-orders`);
      setAllOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getAllOrderLists();
    // eslint-disable-next-line
  }, [auth?.token]);

  // Update order status
  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/update-orders/${orderId}`, { status: value });
      getAllOrderLists();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title="All Orders - Biceps">
      <div className="container-fluid my-4">
        <div className="row">
          <div className="col-md-3 mb-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="authBody text-center">
              {allOrders?.length < 1 ? (
                <h4 className="pnf-title mt-3">NO ORDERS</h4>
              ) : (
                <>
                  <h4 className="pnf-title mt-3 mb-4">ALL ORDERS</h4>
                  {allOrders?.map((order, i) => (
                    <div key={order._id} className="mb-4 border rounded shadow p-3">
                      {/* Order Table */}
                      <table className="table table-bordered mb-3">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Status</th>
                            <th>Buyer</th>
                            <th>Date</th>
                            <th>Payment</th>
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{i + 1}</td>
                            <td>
                              <Select
                                value={order.status}
                                onChange={(value) => handleChange(order._id, value)}
                                style={{ width: '150px' }}
                              >
                                {statusOptions.map((s, idx) => (
                                  <Option key={idx} value={s}>
                                    {s}
                                  </Option>
                                ))}
                              </Select>
                            </td>
                            <td>{order?.buyers?.name}</td>
                            <td>{moment(order?.createdAt).fromNow()}</td>
                            <td>{order?.payment?.success ? "Success" : "Failed"}</td>
                            <td>{order?.products?.length}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Products in Order */}
                      <div className="row">
                        {order?.products?.map((p) => (
                          <div key={p._id} className="col-md-6 mb-3">
                            <div className="card flex-row p-2 align-items-center shadow-sm">
                              <img
                                src={`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-photo/${p._id}`}
                                alt={p.name}
                                width="80"
                                height="80"
                                className="img img-responsive rounded me-3"
                                style={{ objectFit: 'cover' }}
                              />
                              <div className="flex-grow-1 text-start">
                                <h6 className="mb-1">Name: {p.name}</h6>
                                <p className="mb-1">Desc: {p.description.substring(0, 50)}{p.description.length > 50 ? '...' : ''}</p>
                                <h6 className="mb-0">Price: ₹{p.price}</h6>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllOrders;
