import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const productId = product._id || product.id;

  const handleAddToCart = () => {
    const cartProduct = {
      ...product,
      id: productId,
    };
    addToCart(cartProduct);
  };

  const getCartQuantity = () => {
    return cart.find((item) => item.id === productId)?.quantity || 0;
  };

  const cartQuantity = getCartQuantity();

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 product-card">
        <div className="product-image-container">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <i
            className="fas fa-box product-fallback-icon"
            style={{ display: "none" }}
          ></i>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="price">${product.price}</span>
              <span className="weight">{product.weight}</span>
            </div>
            <div className="d-flex gap-2">
              <Link
                to={`/product/${productId}`}
                className="btn btn-outline-primary btn-sm flex-fill"
              >
                <i className="fas fa-eye"></i> View Details
              </Link>
              <button
                className="btn btn-success btn-sm position-relative"
                onClick={handleAddToCart}
                title="Add to Cart"
              >
                <i className="fas fa-cart-plus"></i>
                {cartQuantity > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartQuantity}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
