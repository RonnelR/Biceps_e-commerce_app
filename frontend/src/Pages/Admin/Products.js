import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layouts/Layout';
import AdminMenu from '../../Components/Layouts/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

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
     //eslint-disable-next-line
  }, []);

  return (
    <Layout title="All Products - Biceps">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3"><AdminMenu /></div>
          <div className="col-md-9">
            <div className="text-center authBody mt-3">
              <h4 className="pnf-title text-center mt-3">PRODUCTS</h4>
              <div className="d-flex flex-wrap">
                {products.map((p) => (
                  <Link key={p._id} to={`/dashboard/admin/products/${p.slug}`} className="product-link">
                    <div className="card m-2" style={{ width: '10rem' }}>
                      <img src={`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                      <hr />
                      <div className="card-body text-center">
                        <h5 className="card-title">{p.name}</h5>
                        <h5 className="card-title">₹ {p.price}</h5>
                        <h6 className="card-text">{p.description.length > 20 ? `${p.description.substring(0, 20)}...` : p.description}</h6>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
