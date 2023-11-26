const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const dbSimulation = require("../db/dbSimulation");

// simulasi untuk produk
const ProductController = require('../controllers/ProductController');
const ProductModel = require("../models/ProductModel");

const productControllerSimulation = new ProductController(new ProductModel(dbSimulation), dbSimulation);

router.get("/products", productControllerSimulation.getAllProducts.bind(productControllerSimulation));
router.get("/products/:id", productControllerSimulation.getProductById.bind(productControllerSimulation));
router.post("/products", upload.single("image"), productControllerSimulation.createProduct.bind(productControllerSimulation));
router.put("/products/:id", upload.single("image"), productControllerSimulation.updateProduct.bind(productControllerSimulation));
router.delete("/products/:id", productControllerSimulation.deleteProduct.bind(productControllerSimulation));

// simulasi untuk order
const OrderController = require("../controllers/OrderController");
const OrderModel = require("../models/OrderModel")

const orderControllerSimulation = new OrderController(new OrderModel(dbSimulation), dbSimulation);

router.get("/orders", orderControllerSimulation.getAllOrders.bind(orderControllerSimulation));
router.get("/orders/:id", orderControllerSimulation.getOrderById.bind(orderControllerSimulation));
router.post("/orders", orderControllerSimulation.createOrder.bind(orderControllerSimulation));
router.put("/orders/:id", orderControllerSimulation.updateOrder.bind(orderControllerSimulation));
router.put("/orders/status/:id", orderControllerSimulation.updateOrderStatus.bind(orderControllerSimulation));
router.delete("/orders/:id", orderControllerSimulation.deleteOrder.bind(orderControllerSimulation));

// simulasi untuk auth user
const isAuthenticated = require("../middleware/isAuthenticated");
const AuthenticationController = require("../controllers/AuthenticationController");
const UserModel = require("../models/userModel");

const authControllerSimulation = new AuthenticationController(new UserModel(dbSimulation), dbSimulation);

router.post("/register", authControllerSimulation.signUp.bind(authControllerSimulation));
router.post("/login", authControllerSimulation.login.bind(authControllerSimulation));
router.get("/profiles", isAuthenticated, authControllerSimulation.profiles.bind(authControllerSimulation));
router.put(
  "/profile/:id",
  isAuthenticated,
  upload.single("photo"),
  authControllerSimulation.editProfile.bind(authControllerSimulation)
);
router.get("/users", authControllerSimulation.getAllUsersData.bind(authControllerSimulation));
router.get("/users/:id", authControllerSimulation.getUserById.bind(authControllerSimulation));

module.exports = router;
