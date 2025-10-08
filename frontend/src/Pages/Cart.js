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
  const [instance, setInstance] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Total price calculation
  const totalPrice = () => {
    let total = 0;
    cart?.forEach((i) => {
      total += i.price;
    });
    return total;
  };

  // Remove item from cart
  const handleRemove = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem('cart', JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Get Braintree token
  const braintreeToken = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/braintree/token`
      );
      if (res?.data) {
        setClientToken(res.data.clientToken);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    braintreeToken();
    // eslint-disable-next-line
  }, [auth?.token]);

  // Handle payment
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/braintree/payment`,
        { nonce, cart }
      );
      if(data){
 setLoading(false);
      setCart([]);
      localStorage.setItem('cart', JSON.stringify([]));
      navigate('/dashboard/user/orders');
      toast.success('Payment Completed Successfully');
      }
     
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout title={"Cart items - Biceps"}>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12 text-center mt-3'>
            {auth?.user && <h4>Hello {auth.user.name}</h4>}
            {auth?.token ? (
              cart?.length < 1 ? (
                <p>No products in the cart</p>
              ) : (
                <h6>{cart?.length} products in the cart</h6>
              )
            ) : (
              <h6>
                {cart.length} products in the cart,
                <Link to={'/login'}> login</Link> to checkout
              </h6>
            )}
          </div>
        </div>

        <div className='row'>
          <div className='col-md-8 text-center mt-3'>
            <h5>Products</h5>
            <hr />

            {cart?.map((p) => (
              <div className='row card flex-row mt-2' key={p?._id}>
                <div className='col-md-8'>
                  <img
                    src={`/api/v1/product/product-photo/${p?._id}`}
                    className='card-img-top'
                    alt={p.name}
                  />
                </div>
                <div className='col-md-4 mt-5'>
                  <h6>Name: {p.name}</h6>
                  <h6>Price: ${p?.price}</h6>
                  <p>
                    Description:{' '}
                    {p?.description?.length > 20
                      ? p.description.substring(0, 20) + '...'
                      : p.description}
                  </p>
                  <button
                    className='btn btn-danger'
                    onClick={() => handleRemove(p._id)}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className='col-md-4 text-center mt-3'>
            <h3>Cart Summary</h3>
            <h5>Total | Payment | Checkout</h5>
            <hr />
            {auth?.token && (
              <>
                <h5>Current Address</h5>
                <h6>{auth?.user?.address}</h6>
              </>
            )}
            {cart.length > 0 && <h5>Total - ${totalPrice()}</h5>}

            {auth?.token ? (
              <Link to={'/dashboard/user/profile'}>
                <button className='btn btn-warning'>UPDATE ADDRESS</button>
              </Link>
            ) : cart?.length < 1 ? (
              ''
            ) : (
              <Link to={'/login'}>
                <button className='btn btn-warning'>LOGIN FOR CHECKOUT</button>
              </Link>
            )}

            <hr />

            <div className='mt-2'>
              {clientToken && cart?.length > 0 && auth?.token && (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: 'vault',
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />
                  <button
                    className='btn btn-primary'
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
