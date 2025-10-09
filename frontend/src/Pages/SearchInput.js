import React from "react";
import Layout from "../Components/Layouts/Layout";
import { useSearch } from "../Context/SearchContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../Context/CartContext";

const SearchInput = () => {
  const navigate = useNavigate();
  const [values] = useSearch();
  const [cart, setCart] = useCart();

  const handleCart = (product) => {
    setCart([...cart, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    toast.success("Product added to cart!");
  };

  return (
    <Layout title={"Available Products - Biceps"}>
      <div className="container py-4">
        <div className="text-center mb-4">
          <h4 className="pnf-title mt-3">Searched Products</h4>
          <h6 className="text-secondary">
            {values?.results.length < 1
              ? "No products were found"
              : `${values?.results.length} product${
                  values?.results.length > 1 ? "s" : ""
                } found`}
          </h6>
        </div>

        {/* Product cards */}
        <div className="row justify-content-center">
          {values?.results.length > 0 &&
            values?.results.map((p) => (
              <div
                className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex justify-content-center"
                key={p._id}
              >
                <div
                  className="card cardStyle text-center"
                  style={{ width: "15rem" }}
                >
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    className="card-img-top mt-3"
                  />
                  <div className="card-body">
                    <h6 className="fw-bold">{p.name}</h6>
                    <h5 className="text-dark">${p.price}</h5>
                    <p className="text-muted small">
                      {p.description.length > 25
                        ? `${p.description.substring(0, 25)}...`
                        : p.description}
                    </p>

                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/product-details/${p.slug}`)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() => handleCart(p)}
                      >
                        Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {values?.results.length === 0 && (
            <div className="text-center text-muted py-5">
              <h5>No matching products found 🛒</h5>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchInput;
