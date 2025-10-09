import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layouts/Layout";
import UserMenu from "../../Components/Layouts/UserMenu";
import axios from "axios";
import { useAuth } from "../../Context/Auth";
import moment from "moment";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth({});

  const getOrderLists = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/order-lists`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderLists();
    //eslint-disable-next-line
  }, [auth?.token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return <span className="badge bg-success">{status}</span>;
      case "Processing":
        return <span className="badge bg-warning">{status}</span>;
      case "Cancelled":
        return <span className="badge bg-danger">{status}</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <Layout title={"Orders - Biceps"}>
      <div className="container-fluid my-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <UserMenu />
          </div>

          {/* Orders List */}
          <div className="col-md-9">
            <h3 className="text-center mb-4">All Orders</h3>

            {orders.length === 0 ? (
              <h5 className="text-center">No orders found!</h5>
            ) : (
              orders.map((o, index) => (
                <div className="card mb-4 shadow-sm" key={o?._id}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Order #{index + 1}</h5>
                    {getStatusBadge(o?.status)}
                  </div>

                  <div className="card-body">
                    <div className="row mb-3 text-center text-md-start">
                      <div className="col-md-4 mb-2 mb-md-0">
                        <strong>Buyer:</strong> {o?.buyers?.name}
                      </div>
                      <div className="col-md-4 mb-2 mb-md-0">
                        <strong>Date:</strong> {moment(o?.createAt).fromNow()}
                      </div>
                      <div className="col-md-4">
                        <strong>Payment:</strong>{" "}
                        {o?.payment.success ? (
                          <span className="text-success">Success</span>
                        ) : (
                          <span className="text-danger">Failed</span>
                        )}
                      </div>
                    </div>

                    {/* Products */}
                    <div className="row g-3">
                      {o?.products?.map((p) => (
                        <div className="col-md-6" key={p._id}>
                          <div className="card h-100 flex-row p-2 align-items-center">
                            <img
                              src={`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-photo/${p._id}`}
                              alt={p.name}
                              className="img-fluid rounded"
                              style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            />
                            <div className="ms-3">
                              <h6 className="mb-1">{p.name}</h6>
                              <p className="mb-1 text-muted">
                                {p.description.substring(0, 50)}...
                              </p>
                              <p className="mb-0 fw-bold">${p.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserOrders;
