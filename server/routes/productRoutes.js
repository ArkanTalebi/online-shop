const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRoles = require("../middleware/verifyRoles");

router.route("/public").get(productsController.getAllAvailableProducts);

router.use(verifyJWT);

router
  .route("/")
  .get(productsController.getAllProducts)
  .post(verifyRoles("Admin"), productsController.createNewProduct)
  .patch(verifyRoles("Admin"), productsController.updateProduct)
  .delete(verifyRoles("Admin"), productsController.deleteProduct);

module.exports = router;
