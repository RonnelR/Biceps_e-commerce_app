import React from 'react';
import Layout from '../../Components/Layouts/Layout';
import { useAuth } from '../../Context/Auth';
import AdminMenu from '../../Components/Layouts/AdminMenu';

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title="Admin Dashboard - Biceps">
      <div className="container-fluid my-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <AdminMenu />
          </div>

          {/* Admin Info */}
          <div className="col-md-6">
            <div className="card shadow authBody p-4 text-center">
              <h2 className="mb-3">{auth?.user?.name || "Admin Name"}</h2>
              <p className="mb-1">
                <strong>Email:</strong> {auth?.user?.email || "admin@example.com"}
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> {auth?.user?.phone || "N/A"}
              </p>
              <p className="mb-0">
                <strong>Address:</strong> {auth?.user?.address || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
