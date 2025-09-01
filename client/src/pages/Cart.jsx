import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartCount,
    clearCart,
  } = useCart();
  const { currentUser } = useAuth();
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }

    const order = {
      id: Date.now().toString(),
      username: currentUser.username,
      orderDate: new Date().toISOString(),
      items: [...cart],
      totalAmount: getCartTotal(),
      status: "pending"
    };

    const userOrders = JSON.parse(localStorage.getItem('userOrders')) || {};
    if (!userOrders[currentUser.username]) {
      userOrders[currentUser.username] = [];
    }
    userOrders[currentUser.username].push(order);
    localStorage.setItem('userOrders', JSON.stringify(userOrders));

    clearCart();
    setCheckoutMessage(
      "Thank you for your purchase! Your order has been processed."
    );
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="main-container fade-in">
          <h1 className="page-title">
            <i className="fas fa-shopping-cart"></i> Shopping Cart
          </h1>
          {checkoutMessage ? (
            <div className="text-center py-5">
              <div className="alert alert-success" role="alert">
                <i className="fas fa-check-circle fa-2x mb-3"></i>
                <h3>{checkoutMessage}</h3>
                <p className="text-muted">Your cart has been cleared.</p>
                <a href="/products" className="btn btn-primary">
                  <i className="fas fa-box"></i> Continue Shopping
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
              <h3>Your cart is empty</h3>
              <p className="text-muted">Add some products to get started!</p>
              <a href="/products" className="btn btn-primary">
                <i className="fas fa-box"></i> Browse Products
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-container fade-in">
        <h1 className="page-title">
          <i className="fas fa-shopping-cart"></i> Shopping Cart
        </h1>
        <div className="row">
          <div className="col-md-8">
            {cart.map((item) => (
              <div key={item.id} className="card mb-3">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <div
                        className="product-image"
                        style={{ height: "80px", fontSize: "2rem" }}
                      >
                        <i className={item.icon}></i>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <h5>{item.name}</h5>
                      <p className="text-muted">${item.price} each</p>
                    </div>
                    <div className="col-md-3">
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="mx-2 fw-bold">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <strong>${item.price * item.quantity}</strong>
                    </div>
                    <div className="col-md-1">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <div className="cart-total">
              <h4>
                <i className="fas fa-receipt"></i> Order Summary
              </h4>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Items:</span>
                <span>{getCartCount()}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Total:</span>
                <span className="h4">${getCartTotal()}</span>
              </div>
              <button
                className="btn btn-warning w-100 mb-2"
                onClick={handleCheckout}
              >
                <i className="fas fa-credit-card"></i> Checkout
              </button>
              <a href="/products" className="btn btn-outline-light w-100">
                <i className="fas fa-arrow-left"></i> Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
