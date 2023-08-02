const express = require("express");
const { handleCreateProduct, handleGetProducts, handleGetProduct, handleDeleteProduct, handleUpdateProduct } = require("../controllers/productController");
const upload = require("../middlewares/uploadFile");
const { validateProduct } = require("../validators/product");
const runValidation = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const productRouter = express.Router();

//create product
productRouter.post(
  "/",
  upload.single("image"),
  validateProduct,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateProduct
);


//get all product
productRouter.get(
  "/",
  handleGetProducts
);

//get single product
productRouter.get(
  "/:slug",
  handleGetProduct
);

//update product
productRouter.put(
  "/:slug",
  upload.single("image"),
  isLoggedIn,
  isAdmin,
  handleUpdateProduct
);

//delete single product
productRouter.delete(
  "/:slug",
  isLoggedIn,
  isAdmin,
  handleDeleteProduct
);

module.exports = productRouter;
