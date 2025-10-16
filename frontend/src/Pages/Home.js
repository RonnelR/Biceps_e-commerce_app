import React, { useState, useEffect } from "react";
import Layout from "../Components/Layouts/Layout";
import { Checkbox, Radio } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/Auth";
import { Prices } from "../Components/Layouts/Prices";
import CarouselPage from "../Components/Layouts/CarouselPage";
import { HeartIcon} from "lucide-react"


const Home = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);


  //wishlist
  const [wishlistItems, setWishlistItems] = useState([]);





  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);


  // Fetch categories
  const getAllCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/category/all-category`
      );
      if (res.data?.success) setCategories(res.data.allCategory);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  // Fetch products
  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-list/${page}`
      );
      if (res.data?.success) setProducts(res.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  // Total product count
  const getTotalCount = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-count`
      );
      if (res.data) setTotal(res.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  // Filtered products
  const filterProducts = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-filter`,
        { checked, radio }
      );
      if (res.data?.success) setProducts(res.data.product);
    } catch (error) {
      toast.error("Something went wrong while filtering");
    }
  };

  // Load more products
  const loadMore = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      if (res.data?.success)
        setProducts([...products, ...res.data.product]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Wishlist
  const getWishlist = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/getWishlist`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    if (data.success) {
      setWishlistItems(data.wishlist.map((b) => b._id));
    }
  } catch (error) {
    console.log("Error fetching wishlist:", error);
  }
};

  
  //wishlist toggle 
   const handleToggleSave = async (e, pId) => {
  e.stopPropagation();
  try {
    if (!wishlistItems.includes(pId)) {
      // Add to wishlist
      const { data } = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/addWishlist/${pId}`,
        {},
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );
      if (data.success) {
        setWishlistItems((prev) => [...prev, pId]); // ✅ add
        toast.success("Added to wishlist!");
      }
    } else {
      // Remove from wishlist
      const { data } = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/removeWishlist/${pId}`,
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );
      if (data.success) {
        setWishlistItems((prev) => prev.filter((id) => id !== pId)); // ✅ remove
        toast.error("Removed from wishlist!");
      }
    }
  } catch (err) {
    console.error("Toggle wishlist error:", err.response?.data || err.message);
    toast.error("Something went wrong");
  }
};


  // Cart
  const handleCart = (product) => {
    setCart([...cart, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    toast.success("Product added to cart!");
  };

  // Handle filter
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) all.push(id);
    else all = all.filter((c) => c !== id);
    setChecked(all);
  };

  // useEffect hooks
  useEffect(() => {
    getAllCategories();
    getTotalCount();
    getProducts();
    getWishlist();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (checked.length || radio.length) filterProducts();
    else getProducts();
    // eslint-disable-next-line
  }, [checked, radio]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
    // eslint-disable-next-line
  }, [page]);

  return (
    <Layout title="Shop Now - Biceps">
      <CarouselPage />
      <div className="container-fluid py-4">
        <div className="row">
          {/* Filters */}
          <div className="col-lg-3 col-md-4 mb-4">
            <div className="bg-white shadow-sm rounded p-3 sticky-top" style={{ top: "20px" }}>
              <h4 className="text-center mb-3">Filter by Category</h4>
              <div className="d-flex flex-column">
                {categories.map((c) => (
                  <Checkbox
                    key={c._id}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                    className="mb-2"
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </div>

              <h4 className="text-center mt-4 mb-3">Filter by Price</h4>
              <Radio.Group
                className="d-flex flex-column"
                onChange={(e) => setRadio(e.target.value)}
              >
                {Prices.map((p) => (
                  <Radio key={p._id} value={p.array} className="mb-2">
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>

              <button
                className="btn btn-outline-secondary w-100 mt-4"
                onClick={() => window.location.reload()}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Products */}
          <div className="col-lg-9 col-md-8">
         
            <div className="row justify-content-center">
              {products.map((p) => (
                <div
                  className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex justify-content-center"
                  key={p._id}
                >
                  <div
                    className="card cardStyle text-center shadow-sm"
                    style={{
                      width: "100%",
                      maxWidth: "18rem",
                      transition: "transform 0.3s",
                    }}
                  >
                    <div className="position-relative">
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/api/v1/product/product-photo/${p._id}`
                       
                        }
                        alt={p.name}
                        className="card-img-top mt-3"
                        style={{ height: "180px", objectFit: "cover" }}
                      />
            

{wishlistItems.includes(p?._id) ?  ( <HeartIcon
      onClick={(e) => handleToggleSave(e, p._id)}
      style={{
        width: "20px",
        height: "20px",
        cursor: "pointer",
        color: "red",
      }}
      fill="currentColor"
    />
  ) : (
    <HeartIcon
      onClick={(e) => handleToggleSave(e, p._id)}
      onMouseEnter={(e) => (e.target.style.color = "black")}
      onMouseLeave={(e) => (e.target.style.color = "gray")}
    />
  )}

                    </div>
                    <div className="card-body d-flex flex-column">
                      <h6 className="fw-bold">{p.name}</h6>
                      <h5 className="text-dark mb-2">${p.price}</h5>
                      <p className="text-muted small mb-3">
                        {p.description.length > 40
                          ? `${p.description.substring(0, 40)}...`
                          : p.description}
                      </p>
                      <div className="d-flex justify-content-between mt-auto">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            navigate(`/product-details/${p.slug}`)
                          }
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
            </div>

            {/* Load More */}
            {checked.length < 1 &&
              radio.length < 1 &&
              products.length < total && (
                <div className="text-center mt-3">
                  <button
                    className="btn btn-outline-dark px-4"
                    onClick={() => setPage(page + 1)}
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
