const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const ordersController = require("../controllers/ordersController");
const productsController = require("../controllers/productsController");

router
  .route("/users")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

router
  .route("/products")
  .get(productsController.getAllProducts)
  .post(productsController.createNewProduct)
  .patch(productsController.updateProduct)
  .delete(productsController.deleteProduct);

router
  .route("/products/public")
  .get(productsController.getAllAvailableProducts);

router
  .route("/orders")
  .get(ordersController.getAllOrders)
  .post(ordersController.createNewOrder)
  .patch(ordersController.updateOrder)
  .delete(ordersController.deleteOrder);

module.exports = router;
