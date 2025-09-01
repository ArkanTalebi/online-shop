import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../services/api.js";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    weight: "",
    imageUrl: "",
    available: true,
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    if (!formData.name || !formData.price || !formData.imageUrl) {
      setAlert({
        type: "danger",
        message: "Name, price, and image URL are required",
      });
      setLoading(false);
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseInt(formData.price),
      };

      await productAPI.createProduct(productData);
      setAlert({
        type: "success",
        message: "Product added successfully!",
      });

      setFormData({
        name: "",
        price: "",
        description: "",
        weight: "",
        imageUrl: "",
        available: true,
      });

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (error) {
      console.error("Error adding product:", error);
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Failed to add product",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="main-container fade-in">
        <h1 className="page-title">
          <i className="fas fa-plus"></i> Add New Product
        </h1>

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

        <div className="row justify-content-center">
          <div className="col-md-8">
            <form onSubmit={handleSubmit} className="card p-4">
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
                      rows="4"
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
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i> Add Product
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
