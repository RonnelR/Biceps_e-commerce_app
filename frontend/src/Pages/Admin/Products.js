import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layouts/Layout';
import AdminMenu from '../../Components/Layouts/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

const Products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/all-product`);
      if (res.data?.success) setProducts(res.data.allProduct);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to fetch products');
    }
  };

  useEffect(() => {
    getAllProducts();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout title="All Products - Biceps">
      <div className="container-fluid my-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <AdminMenu />
          </div>

          {/* Products */}
          <div className="col-md-9">
            <div className="card shadow authBody p-4">
              <h4 className="text-center mb-4">PRODUCTS</h4>

              {products.length < 1 && <p className="text-center w-100">No products found</p>}

              <div className="row g-3">
                {products.map((p) => (
                  <div key={p._id} className="col-6 col-sm-6 col-md-4 col-lg-3">
                    <Link
                      to={`/dashboard/admin/products/${p.slug}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="card h-100 shadow-sm rounded hover-shadow">
                        <div className="overflow-hidden">
                          <img
                            src={`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-photo/${p._id}`}
                            alt={p.name}
                            className="card-img-top"
                            style={{ height: '180px', objectFit: 'cover', transition: 'transform 0.3s' }}
                          />
                        </div>
                        <div className="card-body text-center p-3">
                          <h5 className="card-title mb-1">{p.name}</h5>
                          <h6 className="text-primary mb-2">₹ {p.price}</h6>
                          <Tooltip title={p.description}>
                            <p className="card-text text-muted mb-0">
                              {p.description.length > 40 ? `${p.description.substring(0, 40)}...` : p.description}
                            </p>
                          </Tooltip>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-shadow:hover img {
          transform: scale(1.05);
        }
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </Layout>
  );
};

export default Products;
