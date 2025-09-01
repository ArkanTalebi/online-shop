import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isAdmin) {
      navigate("/orders");
      return;
    }
    fetchAllOrders();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userOrders = JSON.parse(localStorage.getItem('userOrders')) || {};
      const allOrdersArray = [];
      
      Object.keys(userOrders).forEach(username => {
        userOrders[username].forEach(order => {
          allOrdersArray.push({
            ...order,
            username: username
          });
        });
      });
      
      setAllOrders(allOrdersArray.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const userOrders = JSON.parse(localStorage.getItem('userOrders')) || {};
    
    Object.keys(userOrders).forEach(username => {
      userOrders[username] = userOrders[username].map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
    });
    
    localStorage.setItem('userOrders', JSON.stringify(userOrders));
    fetchAllOrders();
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
            <button className="btn btn-primary" onClick={fetchAllOrders}>
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
          <i className="fas fa-clipboard-list"></i> All Orders
        </h1>
        
        {allOrders.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
            <h3>No orders found</h3>
            <p className="text-muted">No orders have been placed yet.</p>
          </div>
        ) : (
          <div className="row">
            {allOrders.map((order) => (
              <div key={order.id} className="col-12 mb-4">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-0">
                        <i className="fas fa-receipt"></i> Order #{order.id}
                      </h5>
                      <small className="text-muted">Customer: {order.username}</small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <select 
                        className="form-select form-select-sm"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        style={{ width: 'auto' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <span className={`badge ${order.status === 'completed' ? 'bg-success' : order.status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <p><strong>Customer:</strong> {order.username}</p>
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

export default AdminOrders;
