import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../services/api.js";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    weight: "",
    imageUrl: "",
    available: true,
  });

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setAlert({ type: "danger", message: "Failed to load products" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      weight: "",
      imageUrl: "",
      available: true,
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        ...formData,
        price: parseInt(formData.price),
      };

      if (editingProduct) {
        await productAPI.updateProduct({
          id: editingProduct._id,
          ...productData,
        });
        setAlert({ type: "success", message: "Product updated successfully!" });
      } else {
        await productAPI.createProduct(productData);
        setAlert({ type: "success", message: "Product added successfully!" });
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Failed to save product",
      });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      weight: product.weight || "",
      imageUrl: product.imageUrl,
      available: product.available,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await productAPI.deleteProduct(productId);
      setAlert({ type: "success", message: "Product deleted successfully!" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Failed to delete product",
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="container">
        <div className="main-container">
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/products")}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="container">
      <div className="main-container fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title">
            <i className="fas fa-cog"></i> Admin Dashboard
          </h1>
          <button
            className="btn btn-success"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fas fa-plus"></i> Add New Product
          </button>
        </div>

        {alert && (
          <div
            className={`alert alert-${alert.type} alert-dismissible fade show`}
          >
            {alert.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlert(null)}
            ></button>
          </div>
        )}

        {showAddForm && (
          <div className="card mb-4">
            <div className="card-header">
              <h5>{editingProduct ? "Edit Product" : "Add New Product"}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Weight/Specs</label>
                      <input
                        type="text"
                        className="form-control"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="available"
                          checked={formData.available}
                          onChange={handleChange}
                        />
                        <label className="form-check-label">
                          Available for purchase
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save"></i>{" "}
                    {editingProduct ? "Update" : "Save"} Product
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h5>Product Management</h5>
          </div>
          <div className="card-body">
            {products.length === 0 ? (
              <p className="text-center text-muted">No products found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Weight</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="img-thumbnail"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/50x50?text=No+Image";
                            }}
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.weight || "N/A"}</td>
                        <td>
                          <span
                            className={`badge ${
                              product.available ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {product.available ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(product)}
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(product._id)}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
