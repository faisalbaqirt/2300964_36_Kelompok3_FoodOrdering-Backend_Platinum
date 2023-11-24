const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const OrderModel = require("../models/OrderModel")
const db = require("../db/db");

const orderController = new OrderController(new OrderModel(db), db);

router.get("/", orderController.getAllOrders.bind(orderController));
router.get("/:id", orderController.getOrderById.bind(orderController));
router.post("/", orderController.createOrder.bind(orderController));
router.put("/:id", orderController.updateOrder.bind(orderController));
router.put("/status/:id", orderController.updateOrderStatus.bind(orderController));
router.delete("/:id", orderController.deleteOrder.bind(orderController));

module.exports = router;
