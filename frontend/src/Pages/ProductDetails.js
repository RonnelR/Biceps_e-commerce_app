import React, { useEffect, useState } from "react";
import Layout from "../Components/Layouts/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();

  // Fetch single product
  const getProductDetails = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/single-product/${params.slug}`
      );
      if (res.data?.success) {
        setProduct(res.data.singleProd);
        fetchRelatedProducts(
          res.data.singleProd._id,
          res.data.singleProd.category?._id
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch product details");
    }
  };

  // Fetch related products
  const fetchRelatedProducts = async (pid, cid) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/relared-products/${pid}/${cid}`
      );
      if (res.data?.success) setRelatedProducts(res.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  // Add to cart (main)
  const handleCart = (item) => {
    setCart([...cart, item]);
    localStorage.setItem("cart", JSON.stringify([...cart, item]));
    toast.success("Product added to cart!");
    navigate("/Cart");
  };

  // Add to cart (related)
  const handleCartRelated = (item) => {
    setCart([...cart, item]);
    localStorage.setItem("cart", JSON.stringify([...cart, item]));
    toast.success("Product added to cart!");
  };

  useEffect(() => {
    if (params.slug) getProductDetails();
    // eslint-disable-next-line
  }, [params.slug]);

  return (
    <Layout title={product.name || "Product Details"}>
      <div className="container py-4">
        <div className="text-center mb-4">
          <h3 className="fw-bold">Product Details</h3>
          <div className="divider mx-auto mb-3"></div>
        </div>

        {/* Product details section */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-5 col-md-6 col-sm-12 text-center mb-3 mb-md-0">
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-photo/${product._id}`}
              alt={product.name}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </div>

          <div className="col-lg-7 col-md-6 col-sm-12">
            <h4 className="fw-bold">{product.name}</h4>
            <p className="text-muted">{product.description}</p>
            <p>
              <strong>Category:</strong> {product.category?.name}
            </p>
            <h5 className="text-success fw-semibold mb-3">
              ₹{product.price?.toLocaleString("en-IN")}
            </h5>
            <button
              className="btn btn-primary px-4 py-2"
              onClick={() => handleCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products">
          <h4 className="fw-bold mb-3">Similar Products</h4>
          <div className="row justify-content-center">
            {relatedProducts?.length > 0 ? (
              relatedProducts.map((p) => (
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
                      <h5 className="text-dark">₹{p.price}</h5>
                      <p className="text-muted small">
                        {p.description?.length > 25
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
                          onClick={() => handleCartRelated(p)}
                        >
                          Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-4">
                <p>No similar products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
