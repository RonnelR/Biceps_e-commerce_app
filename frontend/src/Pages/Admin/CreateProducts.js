import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layouts/Layout';
import AdminMenu from '../../Components/Layouts/AdminMenu';
import { Select } from 'antd';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const CreateProducts = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photo, setPhoto] = useState(null);
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [shipping, setShipping] = useState(null); // initialize with null

  // Fetch all categories
  const getAllCat = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/all-category`);
      if (res.data?.success) setCategories(res.data.allCategory);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to fetch categories');
    }
  };

  useEffect(() => {
    getAllCat();
    // eslint-disable-next-line
  }, []);

  // Create product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shipping) {
      toast.error('Please select shipping option');
      return;
    }
    try {
      const productData = new FormData();
      productData.append('name', name);
      productData.append('description', description);
      productData.append('price', price);
      productData.append('quantity', quantity);
      if (photo) productData.append('photo', photo);
      productData.append('category', category);
      productData.append('shipping', shipping);

      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/create-product`, productData);
      if (data?.success) {
        toast.success('Product created successfully');
        navigate('/dashboard/admin/products');
      } else {
        toast.error(data?.error || 'Failed to create product');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <Layout title={'Create Product - Biceps'}>
      <div className="container-fluid my-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <AdminMenu />
          </div>

          {/* Form */}
          <div className="col-md-8">
            <div className="card shadow authBody p-4">
              <h4 className="text-center mb-4">CREATE PRODUCT</h4>
              <form onSubmit={handleSubmit}>
                {/* Category Select */}
                <Select
                  className="col-12 mb-3"
                  placeholder="Select Category"
                  value={category || null}
                  onChange={(value) => setCategory(value)}
                  required
                >
                  <Option value={null} disabled>
                    Please select category
                  </Option>
                  {categories.map((c) => (
                    <Option key={c._id} value={c._id}>{c.name}</Option>
                  ))}
                </Select>

                {/* Photo Upload */}
                <div className="mb-3 text-center">
                  <label className="btn btn-outline-secondary col-12">
                    {photo ? photo.name : 'Upload Photo'}
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      hidden
                    />
                  </label>
                </div>

                {photo && (
                  <div className="text-center mb-3">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height="200px"
                      className="img img-responsive rounded"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* Name */}
                <input
                  type="text"
                  className="form-control mb-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Product name"
                  required
                />

                {/* Description */}
                <textarea
                  className="form-control mb-3"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description..."
                  required
                />

                {/* Quantity */}
                <input
                  type="number"
                  className="form-control mb-3"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Product quantity"
                  required
                />

                {/* Price */}
                <input
                  type="number"
                  className="form-control mb-3"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Product price"
                  required
                />

                {/* Shipping */}
                <Select
                  className="col-12 mb-3"
                  value={shipping}
                  placeholder="Select Shipping"
                  onChange={(value) => setShipping(value)}
                  required
                >
                  <Option value={null} disabled>
                    Please select shipping
                  </Option>
                  <Option value={1}>YES</Option>
                  <Option value={0}>NO</Option>
                </Select>

                {/* Submit Button */}
                <div className="text-center">
                  <button className="btn btn-primary col-6" type="submit">
                    CREATE PRODUCT
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProducts;
