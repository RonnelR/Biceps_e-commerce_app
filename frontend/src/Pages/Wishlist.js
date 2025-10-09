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
      <div className="container my-4">
        <h3 className="text-center mb-4">Wishlist</h3>

        {wishlistItems.length < 1 && (
          <p className="text-center text-muted">Your wishlist is empty</p>
        )}

        <div className="row g-3">
          {wishlistItems.map((p) => (
            <div className="col-md-6" key={p._id}>
              <div className="card shadow h-100 flex-row p-3 align-items-center">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-photo/${p._id}`}
                  alt={p.name}
                  className="img-fluid rounded"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <div className="ms-3 flex-grow-1">
                  <h5 className="mb-1">{p.name}</h5>
                  <p className="mb-1 text-dark"><strong>Price:</strong> ₹{p.price}</p>
                  <p className="mb-2 text-muted">{p.description?.length > 50 ? `${p.description.substring(0, 50)}...` : p.description}</p>
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(p._id)}>Remove</button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/product-details/${p.slug}`)}>View</button>
                  </div>
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
