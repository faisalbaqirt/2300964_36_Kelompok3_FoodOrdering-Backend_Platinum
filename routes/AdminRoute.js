const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");

router.get("/dashboard", AdminController.getDashboardData);
router.get("/orders-chart/:year/:month", AdminController.getOrdersChart);
router.get("/sales-chart/:year/:month", AdminController.getSalesChart);

module.exports = router;
