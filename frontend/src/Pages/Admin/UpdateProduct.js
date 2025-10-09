import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layouts/Layout';
import AdminMenu from '../../Components/Layouts/AdminMenu';
import { Select } from 'antd';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

const UpdateProduct = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photo, setPhoto] = useState(null);
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [shipping, setShipping] = useState('');
  const [id, setId] = useState('');

  // Fetch single product
  const getSingleProduct = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/single-product/${params.slug}`);
      if (res.data?.success) {
        const p = res.data.singleProd;
        setName(p.name);
        setDescription(p.description);
        setQuantity(p.quantity);
        setPrice(p.price);
        setShipping(p.shipping);
        setCategory(p.category?._id);
        setId(p._id);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong while fetching product');
    }
  };

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

  useEffect(() => {
    getSingleProduct();
    getAllCategories();
    // eslint-disable-next-line
  }, []);

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append('name', name);
      productData.append('description', description);
      productData.append('quantity', quantity);
      productData.append('price', price);
      if (photo) productData.append('photo', photo);
      productData.append('category', category);
      productData.append('shipping', shipping);

      const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/update-product/${id}`, productData);
      if (res.data?.success) {
        toast.success('Product updated successfully');
        navigate('/dashboard/admin/products');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update product');
    }
  };

  // Delete product
  const handleDelete = async () => {
    try {
      const answer = window.confirm('Are you sure you want to delete this product?');
      if (!answer) return;
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/delete-product/${id}`);
      toast.success('Product deleted successfully');
      navigate('/dashboard/admin/products');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <Layout title="Update Product - Biceps">
      <div className="container-fluid my-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <AdminMenu />
          </div>

          {/* Form */}
          <div className="col-md-9">
            <div className="card shadow authBody p-4">
              <h3 className="text-center mb-4">Update Product</h3>
              <form onSubmit={handleUpdate} className="w-100">
                {/* Category */}
                <Select
                  className="col-12 mb-3"
                  placeholder="Select category"
                  value={category}
                  onChange={(value) => setCategory(value)}
                >
                  {categories.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>

                {/* Photo */}
                <div className="mb-3 text-center">
                  <label className="btn btn-outline-secondary col-12">
                    {photo ? photo.name : 'Upload Photo'}
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      hidden
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                  </label>
                </div>

                {/* Image Preview */}
                <div className="text-center mb-3">
                  {photo ? (
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product"
                      height="200"
                      className="img img-responsive rounded"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-photo/${id}`}
                      alt="product"
                      height="200"
                      className="img img-responsive rounded"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>

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
                  placeholder="Quantity"
                  required
                />

                {/* Price */}
                <input
                  type="number"
                  className="form-control mb-3"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  required
                />

                {/* Shipping */}
                <Select
                  className="col-12 mb-3"
                  placeholder="Select shipping"
                  value={shipping}
                  onChange={(value) => setShipping(value)}
                  required
                >
                  <Option value={1}>YES</Option>
                  <Option value={0}>NO</Option>
                </Select>

                {/* Buttons */}
                <div className="text-center">
                  <button type="submit" className="btn btn-primary m-2 col-md-4">
                    UPDATE PRODUCT
                  </button>
                  <button type="button" onClick={handleDelete} className="btn btn-danger m-2 col-md-4">
                    DELETE PRODUCT
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

export default UpdateProduct;
