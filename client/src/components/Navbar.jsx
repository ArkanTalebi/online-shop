import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-home"></i> Online Store
        </Link>

        <div className="navbar-nav ms-auto d-flex flex-row align-items-center gap-3">
          {currentUser ? (
            <div>
              <span className="navbar-text me-3">
                Welcome, {currentUser.username}
                {isAdmin && <span className="admin-badge ms-2">Admin</span>}
              </span>
              <Link
                to="/products"
                className="btn btn-outline-light btn-sm me-2"
              >
                <i className="fas fa-box"></i> Products
              </Link>
              <Link to="/orders" className="btn btn-outline-light btn-sm me-2">
                <i className="fas fa-shopping-bag"></i> My Orders
              </Link>
              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className="btn btn-outline-info btn-sm me-2"
                  >
                    <i className="fas fa-cog"></i> Admin Dashboard
                  </Link>
                  <Link
                    to="/admin-orders"
                    className="btn btn-outline-info btn-sm me-2"
                  >
                    <i className="fas fa-clipboard-list"></i> All Orders
                  </Link>
                  <Link
                    to="/add-product"
                    className="btn btn-outline-warning btn-sm me-2"
                  >
                    <i className="fas fa-plus"></i> Add Product
                  </Link>
                </>
              )}
              <Link
                to="/cart"
                className="btn btn-outline-light btn-sm me-2 position-relative"
              >
                <i className="fas fa-shopping-cart"></i> Cart
                <span className="cart-badge">{getCartCount()}</span>
              </Link>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          ) : (
            <div>
              <Link to="/login" className="btn btn-outline-light btn-sm me-2">
                <i className="fas fa-sign-in-alt"></i> Login
              </Link>
              <Link to="/register" className="btn btn-outline-success btn-sm">
                <i className="fas fa-user-plus"></i> Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
