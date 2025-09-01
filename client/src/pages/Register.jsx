import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState(null);
  const { register } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: "danger", message: "Passwords do not match" });
      return;
    }

    if (formData.password.length < 6) {
      setAlert({
        type: "danger",
        message: "Password must be at least 6 characters",
      });
      return;
    }

    const result = await register(formData.username, formData.password);

    if (result.success) {
      setAlert({ type: "success", message: result.message });
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
                  <i className="fas fa-user-plus"></i> Register
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
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success w-100">
                    <i className="fas fa-user-plus"></i> Register
                  </button>
                </form>

                <div className="text-center mt-3">
                  <p>
                    Already have an account?{" "}
                    <a href="/login" className="text-decoration-none">
                      Login here
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

export default Register;
