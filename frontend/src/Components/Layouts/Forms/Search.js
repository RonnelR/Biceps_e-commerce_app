import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../../Context/SearchContext';
import toast from 'react-hot-toast';

const Search = () => {
  const [values, setValues] = useSearch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!values.keyword.trim()) {
      toast.error("Please enter a keyword to search!");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/search-product/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate('/search');
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="d-flex my-2" onSubmit={handleSearch}>
      <input
        type="search"
        className="form-control me-2"
        placeholder="Search products..."
        value={values.keyword}
        onChange={(e) =>
          setValues({ ...values, keyword: e.target.value })
        }
      />
      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Search;
