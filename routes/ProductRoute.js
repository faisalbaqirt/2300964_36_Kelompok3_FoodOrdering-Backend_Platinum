const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const ProductController = require("../controllers/ProductController");
const ProductModel = require("../models/ProductModel");
const db = require("../db/db");

const productController = new ProductController(new ProductModel(db), db);

router.get("/", productController.getAllProducts.bind(productController));
router.get("/:id", productController.getProductById.bind(productController));
router.post("/", upload.single("image"), productController.createProduct.bind(productController));
router.put("/:id", upload.single("image"), productController.updateProduct.bind(productController));
router.delete("/:id", productController.deleteProduct.bind(productController));

module.exports = router;
