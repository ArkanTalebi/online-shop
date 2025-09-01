import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { productAPI } from "../services/api.js";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getAvailableProducts();
      const foundProduct = response.data.find((p) => (p._id || p.id) === id);

      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const productId = product._id || product.id;
    const cartProduct = {
      ...product,
      id: productId,
    };
    addToCart(cartProduct);
  };

  const getCartQuantity = () => {
    const productId = product?._id || product?.id;
    return (
      cart.find((item) => (item._id || item.id) === productId)?.quantity || 0
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className="main-container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="main-container">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error || "Product not found"}</p>
            <hr />
            <a href="/products" className="btn btn-primary">
              Back to Products
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0">
            <div className="row g-0 align-items-center">
              <div className="col-md-6 p-4 text-center">
                <div className="product-image-container mb-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image img-fluid rounded"
                    style={{
                      maxHeight: 400,
                      objectFit: "contain",
                      width: "100%",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div
                    className="product-image-fallback"
                    style={{ display: "none" }}
                  >
                    <i className="fas fa-image fa-5x text-muted"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-6 p-4">
                <h1 className="product-title mb-3">{product.name}</h1>
                <p className="product-description lead mb-4">
                  {product.description}
                </p>
                <div className="product-info mb-4">
                  <p>
                    <strong>Weight/Specs:</strong> {product.weight}
                  </p>
                  <p>
                    <strong>Price:</strong>{" "}
                    <span className="price fs-4 text-success">
                      ${product.price}
                    </span>
                  </p>
                </div>
                <div className="product-actions d-flex align-items-center gap-3">
                  <button
                    className="btn btn-success btn-lg"
                    onClick={handleAddToCart}
                  >
                    <i className="fas fa-cart-plus"></i> Add to Cart
                  </button>
                  {getCartQuantity() > 0 && (
                    <span className="badge bg-info fs-6">
                      In Cart: {getCartQuantity()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
