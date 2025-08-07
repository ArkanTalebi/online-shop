import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { productAPI } from "../services/api.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getAvailableProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load products. Please check your connection and try again."
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="main-container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="main-container">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Products</h4>
            <p>{error}</p>
            <hr />
            <p className="mb-0">
              <button className="btn btn-primary" onClick={fetchProducts}>
                Try Again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-container fade-in">
        <h1 className="page-title">
          <i className="fas fa-box"></i> Our Products
        </h1>
        {products.length === 0 ? (
          <div className="text-center">
            <p className="text-muted">No products available at the moment.</p>
          </div>
        ) : (
          <div className="row">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
