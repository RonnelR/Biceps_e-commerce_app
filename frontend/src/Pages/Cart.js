import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layouts/Layout';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/Auth';
import { Link, useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import toast from 'react-hot-toast';

const Cart = () => {
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [clientToken, setClientToken] = useState('');
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const totalPrice = () => cart?.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  const handleRemove = (pid) => {
    const updatedCart = cart.filter(item => item._id !== pid);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Product removed from cart');
  };

  // Fetch Braintree client token
  const braintreeToken = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/braintree/token`);
      if (res?.data?.clientToken) {
        setClientToken(res.data.clientToken);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to load payment gateway');
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (!instance) return toast.error('Payment gateway not loaded');
    setLoading(true);
    try {
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/braintree/payment`,
        { nonce, cart }
      );

      if (data?.ok) {
        setCart([]);
        localStorage.setItem('cart', JSON.stringify([]));
        navigate('/dashboard/user/orders');
        toast.success('Payment Completed Successfully');
      }
    } catch (error) {
      console.log(error);
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token && cart.length > 0) braintreeToken();
    // eslint-disable-next-line
  }, [auth?.token, cart.length]);

  return (
    <Layout title="Cart Items - Biceps">
      <div className='container py-4'>
        <div className='text-center mb-4'>
          {auth?.user && <h4>Hello, {auth.user.name}</h4>}
          <p>{cart.length} product(s) in the cart{!auth?.token && ". Login to checkout."}</p>
        </div>

        <div className='row'>
          {/* Cart Products */}
          <div className='col-lg-8 mb-4'>
            {cart.length < 1 ? (
              <p className="text-center">No products in the cart</p>
            ) : (
              cart.map((p) => (
                <div className='card mb-3 shadow-sm flex-row' key={p._id}>
                  <div className='col-5 p-2'>
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-photo/${p._id}`}
                      className='card-img-top rounded'
                      alt={p.name}
                    />
                  </div>
                  <div className='col-7 p-3 d-flex flex-column justify-content-between'>
                    <div>
                      <h6>{p.name}</h6>
                      <h6>Price: ${p.price}</h6>
                      <p className='text-muted'>
                        {p.description.length > 50 ? `${p.description.substring(0, 50)}...` : p.description}
                      </p>
                    </div>
                    <button
                      className='btn btn-danger mt-2 w-100'
                      onClick={() => handleRemove(p._id)}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary */}
          <div className='col-lg-4'>
            <div className='card p-3 shadow-sm'>
              <h5 className='text-center pnf-title'>Cart Summary</h5>
              <hr />
              {auth?.token && (
                <>
                  <h6>Current Address:</h6>
                  <p>{auth?.user?.address || 'No address added'}</p>
                  <Link to='/dashboard/user/profile'>
                    <button className='btn btn-primary w-100 mb-3'>UPDATE ADDRESS</button>
                  </Link>
                </>
              )}
              <h5>Total: ${totalPrice()}</h5>
              {!auth?.token && cart.length > 0 && (
                <Link to='/login'>
                  <button className='btn btn-primary w-100 mb-3'>LOGIN FOR CHECKOUT</button>
                </Link>
              )}

              {/* Braintree DropIn */}
              {clientToken && cart.length > 0 && auth?.token && (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: 'checkout',
                        amount: totalPrice(),
                        currency: 'USD'
                      }
                    }}
                    onInstance={(inst) => setInstance(inst)}
                  />
                  <button
                    className='btn btn-success w-100 mt-2'
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'MAKE PAYMENT'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
