import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../Context/Auth';
import toast, { Toaster } from 'react-hot-toast';
import Search from './Forms/Search';
import useCategory from '../../Hooks/useCategory';
import { useCart } from '../../Context/CartContext';
import { Badge } from 'antd';

const Header = () => {
  const categories = useCategory();
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();

  const logoutButton = () => {
    setAuth({ ...auth, user: null, token: '' });
    localStorage.removeItem('auth');
    toast.success('User Logged Out!');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-info">
        <div className="container-fluid">
          <img
            style={{ width: '35px', borderRadius: '50%' }}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpD8cirrbgyCl69qM1AsYaNBoaEt6hNJv9Y7WToPUvAwVSXObB"
            alt="logo"
          />
          <Link to="/" className="navbar-brand text-warning p-2 fw-bold">
            BICEPS
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar2"
            aria-controls="offcanvasNavbar2"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="offcanvas offcanvas-end text-bg-dark"
            tabIndex={-1}
            id="offcanvasNavbar2"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">BICEPS</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
              />
            </div>

            <div className="offcanvas-body">
              <Search />
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <NavLink to="/" className="nav-link">
                    Home
                  </NavLink>
                </li>

                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="/Categories"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Categories
                  </Link>
                  <ul className="dropdown-menu bg-dark">
                    <li>
                      <Link to="/Categories" className="dropdown-item text-light">
                        All Products
                      </Link>
                    </li>
                    {categories?.map((c) => (
                      <li key={c?._id}>
                        <Link
                          to={`/Categories-products/${c?.slug}`}
                          className="dropdown-item text-light"
                        >
                          {c?.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                {!auth.user ? (
                  <>
                    <li className="nav-item">
                      <NavLink to="/Registration" className="nav-link">
                        Registration
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/Login" className="nav-link">
                        Login
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      to="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {auth.user.name}
                    </NavLink>
                    <ul className="dropdown-menu bg-dark">
                      <li>
                        <NavLink
                          to={`/dashboard/${auth.user.role === 1 ? 'admin' : 'user'}`}
                          className="dropdown-item text-light"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/Wishlist/get-list"
                          className="dropdown-item text-light"
                        >
                          Wishlist
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={logoutButton}
                          to="/login"
                          className="dropdown-item text-danger"
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                )}

                <li className="nav-item">
                  <Badge count={cart?.length} showZero>
                    <NavLink to="/Cart" className="nav-link">
                      Cart
                    </NavLink>
                  </Badge>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <Toaster />
    </>
  );
};

export default Header;
