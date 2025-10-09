import React from 'react';
import Layout from '../../Components/Layouts/Layout';
import { useAuth } from '../../Context/Auth';
import UserMenu from '../../Components/Layouts/UserMenu';

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title={"Admin Dashboard - Biceps"}>
      <div className="container-fluid my-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <UserMenu />
          </div>

          {/* User Info */}
          <div className="col-md-6">
            <div className="card shadow authBody p-4 text-center">
              <h2 className="mb-3">{auth.user.name}</h2>
              <p className="mb-1"><strong>Email:</strong> {auth.user.email}</p>
              <p className="mb-1"><strong>Phone:</strong> {auth.user.phone}</p>
              <p className="mb-0"><strong>Address:</strong> {auth.user.address}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
