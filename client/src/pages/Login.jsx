import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [alert, setAlert] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    const result = await login(formData.username, formData.password);

    if (result.success) {
      setAlert({ type: "success", message: "Login successful!" });
      setTimeout(() => {
        navigate("/products");
      }, 1000);
    } else {
      setAlert({ type: "danger", message: result.message });
    }
  };

  return (
    <div className="container">
      <div className="main-container fade-in">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h2 className="text-center">
                  <i className="fas fa-sign-in-alt"></i> Login
                </h2>
              </div>
              <div className="card-body">
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

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    <i className="fas fa-sign-in-alt"></i> Login
                  </button>
                </form>

                <div className="text-center mt-3">
                  <p>
                    Don't have an account?{" "}
                    <a href="/register" className="text-decoration-none">
                      Register here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
