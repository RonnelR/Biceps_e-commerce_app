import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layouts/Layout';
import axios from 'axios';
import { useAuth } from '../Context/Auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Fetch wishlist
  const getWishlist = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/wishlist/get-List`);
      if (data?.items?.length > 0) setWishlistItems(data.items[0].wishlistItems);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch wishlist');
    }
  };

  // Remove item from wishlist
  const handleRemove = async (pid) => {
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/wishlist/remove-Products`, { pid });
      if (data) {
        toast.success(data.message);
        getWishlist();
      }
    } catch (error) {
      toast.error('Error removing item from wishlist');
    }
  };

  useEffect(() => {
    if (auth?.token) getWishlist();
     //eslint-disable-next-line
  }, [auth?.token]);

  return (
    <Layout title="Wishlist - Biceps">
      <div className="container mt-3">
        <h4 className="pnf-title text-center mt-2">WISHLIST</h4>
        {wishlistItems.length < 1 && <p className="text-center">Wishlist is empty</p>}

        <div className="text-center m-5">
          {wishlistItems.map((p) => (
            <div className="authBody row card flex-row mt-3" key={p._id}>
              <div className="col-md-8" style={{ width: '15rem' }}>
                <img src={`/api/v1/product/product-photo/${p._id}`} alt={p.name} className="card-img-top" />
              </div>
              <div className="col-md-4 mt-5">
                <h6 className="h6">Name: {p.name}</h6>
                <h6 className="h4 text-dark">Price: ₹{p.price}</h6>
                <p className="h6 text-dark">Description: {p.description?.length > 20 ? `${p.description.substring(0, 20)}...` : p.description}</p>
                <div className="m-1">
                  <button className="btn btn-danger" onClick={() => handleRemove(p._id)}>REMOVE</button>
                </div>
                <div className="m-1">
                  <button className="btn btn-primary" onClick={() => navigate(`/product-details/${p.slug}`)}>MORE</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
