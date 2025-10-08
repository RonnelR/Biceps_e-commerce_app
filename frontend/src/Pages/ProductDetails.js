import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layouts/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();

  // Fetch single product
  const getProductDetails = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/single-product/${params.slug}`);
      if (res.data?.success) {
        setProduct(res.data.singleProd);
        fetchRelatedProducts(res.data.singleProd._id, res.data.singleProd.category?._id);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch product details');
    }
  };

  // Fetch related products
  const fetchRelatedProducts = async (pid, cid) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/relared-products/${pid}/${cid}`);
      if (res.data?.success) setRelatedProducts(res.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  // Add to cart
  const handleCart = (item) => {
    setCart([...cart, item]);
    localStorage.setItem('cart', JSON.stringify([...cart, item]));
    toast.success('Product added to cart!');
    navigate('/Cart');
  };

  // Add to cart for related products
  const handleCartRelated = (item) => {
    setCart([...cart, item]);
    localStorage.setItem('cart', JSON.stringify([...cart, item]));
    toast.success('Product added to cart!');
  };

  useEffect(() => {
    if (params.slug) getProductDetails();
  }, [params.slug]);

  return (
    <Layout title={product.name || 'Product Details'}>
      <div className="container">
        <h3 className="pnf-title text-center mt-3">PRODUCT DETAILS</h3>
        <hr />
        <div className="row authBody">
          <div className="col-md-5 authBody">
            <div className="m-4 p-4">
              <img src={`/api/v1/product/product-photo/${product._id}`} alt={product.name} className="card-img-top" />
            </div>
          </div>

          <div className="col-md-7">
            <div className="m-4 p-4">
              <h4>Name: {product.name}</h4>
              <h4>Description: {product.description}</h4>
              <h4>Category: {product.category?.name}</h4>
              <h4>Price: ₹{product.price}</h4>
              <button className="blueButton" onClick={() => handleCart(product)}>ADD TO CART</button>
            </div>
          </div>
        </div>

        {/* Related products */}
        <div className="row">
          <h4>Similar Products</h4>
          <div className="d-flex flex-wrap">
            {relatedProducts?.map((p) => (
              <div className="card cardStyle m-3" key={p._id} style={{ width: '15rem' }}>
                <img src={`/api/v1/product/product-photo/${p._id}`} alt={p.name} className="card-img-top" />
                <hr />
                <div className="card-body">
                  <h6 className="card-title h6">{p.name}</h6>
                  <h5 className="card-title h4 text-dark">₹{p.price}</h5>
                  <p className="card-text h6 text-muted">{p.description?.length > 20 ? `${p.description.substring(0, 20)}...` : p.description}</p>
                  <div className="row container">
                    <div className="col-md-6 cbBlueBody">
                      <button className="cbBlue" onClick={() => navigate(`/product-details/${p.slug}`)}>MORE</button>
                    </div>
                    <div className="col-md-6 cbDarkBody mt-1">
                      <button className="cbDark" onClick={() => handleCartRelated(p)}>CART</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
