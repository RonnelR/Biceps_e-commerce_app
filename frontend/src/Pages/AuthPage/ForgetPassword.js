import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layouts/Layout';
import { useOtp } from '../../Context/OtpContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [setUserOtp] = useOtp(); // destructure correctly

  const navigate = useNavigate();

  // Function to generate OTP
  const generateOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Email is required');

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/forget-password`, { email });

      if (res?.data?.success) {
        toast.success(res.data.message || 'OTP sent successfully');

        // store email and OTP in context
        setUserOtp({
          email: email,
          otp: res?.data?.otp
        });

        navigate('/Verify-Otp');
      } else {
        toast.error(res?.data?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Forgot Password Error:', error);
      toast.error('Failed to generate OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Forgot Password - Biceps">
      <div className="regAndLog">
        <div className="authBody">
          <h4 className="pnf-title text-center mb-4">FORGOT PASSWORD</h4>
          <form onSubmit={generateOtp}>
            <div>
              <input
                type="email"
                id="inputEmail"
                className="form-control"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="authButton mt-3">
              <button className="loginButton w-full" type="submit" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Generate OTP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
