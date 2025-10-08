import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layouts/Layout';
import { Checkbox, Radio } from 'antd';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/Auth';
import { Prices } from '../Components/Layouts/Prices';
import CarouselPage from '../Components/Layouts/CarouselPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [cart, setCart] = useCart();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  const getAllCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/all-category`);
      if (res.data?.success) setCategories(res.data.allCategory);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch categories');
    }
  };

  // Fetch products
  const getProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-list/${page}`);
      if (res.data?.success) setProducts(res.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch total product count
  const getTotalCount = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-count`);
      if (res.data) setTotal(res.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter products
  const filterProducts = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-filter`, { checked, radio });
      if (res.data?.success) setProducts(res.data.product);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong while filtering');
    }
  };

  // Load more products
  const loadMore = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-list/${page}`);
      setLoading(false);
      if (res.data?.success) setProducts([...products, ...res.data.product]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Wishlist
  const getWishlist = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/wishlist/get-List`);
      if (data?.items?.length > 0) setWishlistItems(data.items[0].wishlistItems);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWish = async (pid) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/wishlist/add-Products`, { pid });
      if (res?.data) {
        getWishlist();
        toast(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Cart
  const handleCart = (product) => {
    setCart([...cart, product]);
    localStorage.setItem('cart', JSON.stringify([...cart, product]));
    toast.success('Product added to cart!');
  };

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) all.push(id);
    else all = all.filter((c) => c !== id);
    setChecked(all);
  };

  useEffect(() => {
    getAllCategories();
    getTotalCount();
    getProducts();
    if (auth?.token) getWishlist();
    //eslint-disable-next-line
  }, [auth?.token]);

  useEffect(() => {
    if (checked.length || radio.length) filterProducts();
    else getProducts();
     //eslint-disable-next-line
  }, [checked, radio]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
     //eslint-disable-next-line
  }, [page]);

  return (
    <Layout title="Shop Now - Biceps">
      <CarouselPage />
      <div className="container-fluid">
        <div className="row">
          {/* Filters */}
          <div className="col-md-3">
            <h4 className="m-3 p-2">Filter by Category</h4>
            <hr />
            <div className="d-flex flex-column">
              {categories.map((c) => (
                <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>{c.name}</Checkbox>
              ))}
            </div>

            <h4 className="m-3 p-2 mt-5">Filter by Price</h4>
            <hr />
            <Radio.Group className="d-flex flex-column" onChange={(e) => setRadio(e.target.value)}>
              {Prices.map((p) => (
                <Radio key={p._id} value={p.array}>{p.name}</Radio>
              ))}
            </Radio.Group>

            <button className="btn btn-danger m-5" onClick={() => window.location.reload()}>RESET FILTERS</button>
          </div>

          {/* Products */}
          <div className="col-md-9">
            <h2 className="pnf-title text-center">All Products</h2>
            <div className="d-flex flex-wrap">
              {products.map((p) => (
                <div className="card m-3 text-center cardStyle" key={p._id} style={{ width: '15rem' }}>
                  <img src={`/api/v1/product/product-photo/${p._id}`} alt={p.name} className="card-img-top mt-3" />

                  {auth?.token && (
                    <button className="wishlistButton" onClick={() => handleWish(p._id)}>
                      <FontAwesomeIcon icon={faHeart} size="2xs" style={{ color: wishlistItems.some(item => item._id === p._id) ? '#ff051e' : 'black' }} />
                    </button>
                  )}

                  <hr />
                  <div className="card-body">
                    <h6 className="h6">{p.name}</h6>
                    <h5 className="h4 text-dark">${p.price}</h5>
                    <p className="h6 text-muted">{p.description.length > 20 ? `${p.description.substring(0, 20)}...` : p.description}</p>
                    <div className="row container">
                      <div className="col-md-6 cbBlueBody">
                        <button className="cbBlue" onClick={() => navigate(`/product-details/${p.slug}`)}>MORE</button>
                      </div>
                      <div className="col-md-6 cbDarkBody mt-1">
                        <button className="cbDark" onClick={() => handleCart(p)}>CART</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load more button */}
            <div className="m-3 text-center">
              {checked.length < 1 && radio.length < 1 && products.length < total && (
                <button className="lmButton" onClick={() => setPage(page + 1)}>
                  {loading ? 'Loading...' : 'Load More...'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
