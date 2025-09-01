import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchUserOrders();
  }, [isAuthenticated, navigate]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userOrders = JSON.parse(localStorage.getItem('userOrders')) || {};
      const currentUserOrders = userOrders[currentUser?.username] || [];
      
      setOrders(currentUserOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="main-container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="main-container">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
            <hr />
            <button className="btn btn-primary" onClick={fetchUserOrders}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-container fade-in">
        <h1 className="page-title">
          <i className="fas fa-shopping-bag"></i> My Orders
        </h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
            <h3>No orders yet</h3>
            <p className="text-muted">Start shopping to see your orders here!</p>
            <a href="/products" className="btn btn-primary">
              <i className="fas fa-box"></i> Browse Products
            </a>
          </div>
        ) : (
          <div className="row">
            {orders.map((order, index) => (
              <div key={order.id} className="col-12 mb-4">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="fas fa-receipt"></i> Order #{order.id}
                    </h5>
                    <span className={`badge ${order.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
                        <p><strong>Total Items:</strong> {order.items.length}</p>
                      </div>
                      <div className="col-md-6 text-md-end">
                        <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                      </div>
                    </div>
                    
                    <h6>Order Items:</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, itemIndex) => (
                            <tr key={itemIndex}>
                              <td>{item.name}</td>
                              <td>${item.price}</td>
                              <td>{item.quantity}</td>
                              <td>${item.price * item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
