import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3500";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const productAPI = {
  getAvailableProducts: () => api.get("/products/public"),

  getAllProducts: () => api.get("/products"),

  createProduct: (productData) => api.post("/products", productData),

  updateProduct: (productData) => api.patch("/products", productData),

  deleteProduct: (id) => api.delete("/products", { data: { id } }),
};

export const authAPI = {
  login: (credentials) => api.post("/auth", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  refresh: () => api.get("/auth/refresh"),
};

export const cartAPI = {
  getCart: () => api.get("/cart"),
  addToCart: (productId, quantity) =>
    api.post("/cart", { productId, quantity }),
  removeFromCart: (productId) => api.delete("/cart", { data: { productId } }),
  updateCartItem: (productId, quantity) =>
    api.patch("/cart", { productId, quantity }),
};

export default api;
