import React, { useEffect, useState } from 'react';
import Layout from '../../Components/Layouts/Layout';
import UserMenu from '../../Components/Layouts/UserMenu';
import { useAuth } from '../../Context/Auth';
import toast from 'react-hot-toast';
import axios from 'axios';

const UserProfile = () => {
  const [auth, setAuth] = useAuth();

  // form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const { name, email, address, phone } = auth?.user || {};
    setName(name || '');
    setEmail(email || '');
    setAddress(address || '');
    setPhone(phone || '');
  }, [auth?.user]);

  const validate = () => {
    const newErrors = {};

    if (!name || name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }

    if (!address || address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // valid if no errors
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/profile`,
        { name, email, password, phone, address }
      );

      if (res?.data?.error) {
        toast.error('Error updating profile');
      } else {
        setAuth({ ...auth, user: res?.data.updatedUser });
        const ls = JSON.parse(localStorage.getItem('auth'));
        ls.user = res?.data.updatedUser;
        localStorage.setItem('auth', JSON.stringify(ls));
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <Layout title="Profile - Biceps">
      <div className="container-fluid py-4">
        <div className="row">
          {/* User Menu */}
          <div className="col-lg-3 mb-4">
            <UserMenu />
          </div>

          {/* Profile Form */}
          <div className="col-lg-7">
            <div className="regAndLog text-center">
              <div className="authBody p-4 shadow-sm">
                <h4 className="pnf-title mb-3">PROFILE</h4>
                <form onSubmit={handleUpdate}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control mb-1"
                    placeholder="Name"
                    required
                  />
                  {errors.name && <small className="text-danger mb-2 d-block">{errors.name}</small>}

                  <input
                    type="email"
                    value={email}
                    className="form-control mb-2"
                    placeholder="Email"
                    disabled
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control mb-1"
                    placeholder="Password (optional)"
                  />
                  {errors.password && <small className="text-danger mb-2 d-block">{errors.password}</small>}

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control mb-1"
                    placeholder="Phone"
                  />
                  {errors.phone && <small className="text-danger mb-2 d-block">{errors.phone}</small>}

                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control mb-3"
                    placeholder="Address"
                  />
                  {errors.address && <small className="text-danger mb-2 d-block">{errors.address}</small>}

                  <div className="authButton">
                    <button type="submit" className="loginButton w-100">
                      UPDATE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
