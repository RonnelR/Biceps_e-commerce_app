import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layouts/Layout';
import AdminMenu from '../../Components/Layouts/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import CategoryForm from '../../Components/Layouts/Forms/CategoryForm';
import { Modal } from 'antd';

const CreateCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (category) => {
    setSelected(category);
    setUpdatedName(category.name);
    setIsModalOpen(true);
  };
  const handleCancel = () => setIsModalOpen(false);

  // Get all categories
  const getAllCat = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/all-category`);
      if (res.data?.success) setCategories(res.data.allCategory);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to fetch categories');
    }
  };

  // Create category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/create-category`, { name });
      if (res.data?.success) {
        toast.success(`${name} ${res.data?.message}`);
        setName('');
        getAllCat();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to create category');
    }
  };

  // Update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/update-category/${selected._id}`, { name: updatedName });
      if (res.data?.success) {
        toast.success(res.data?.message);
        setIsModalOpen(false);
        getAllCat();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to update category');
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/delete-category/${id}`);
      if (res.data?.success) {
        toast.success(res.data?.message);
        getAllCat();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  useEffect(() => {
    getAllCat();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout title={'Manage Categories - Biceps'}>
      <div className="container-fluid my-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="col-md-8">
            <div className="card shadow authBody p-4">
              <h4 className="text-center mb-4">MANAGE CATEGORIES</h4>

              {/* Create Category Form */}
              <CategoryForm value={name} setValue={setName} handleSubmit={handleSubmit} />

              {/* Categories Table */}
              <div className="table-responsive mt-4">
                <table className="table table-bordered table-hover text-center">
                  <thead className="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c._id}>
                        <td>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm me-2 mb-1"
                            onClick={() => showModal(c)}
                          >
                            Edit
                          </button>

                          <Modal
                            title="Update Category"
                            open={isModalOpen}
                            footer={null}
                            onCancel={handleCancel}
                          >
                            <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
                          </Modal>

                          <button
                            className="btn btn-danger btn-sm mb-1"
                            onClick={() => handleDelete(c._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategories;
