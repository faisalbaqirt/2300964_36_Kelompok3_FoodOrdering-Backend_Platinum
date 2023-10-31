const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

router.get("/", OrderController.getAllOrders);
router.get("/:id", OrderController.getOrderById);
router.post("/", OrderController.createOrder);
router.put("/:id", OrderController.updateOrder);
router.put("/status/:id", OrderController.updateOrderStatus);
router.delete("/:id", OrderController.deleteOrder);

module.exports = router;
