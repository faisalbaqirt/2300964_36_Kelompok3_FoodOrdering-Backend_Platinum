const AdminModel = require("../models/adminModel");

class AdminController {
  async getDashboardData(req, res) {
    try {
      const totalProducts = await AdminModel.getTotalProducts();
      const totalOrders = await AdminModel.getTotalOrders();
      const totalUsers = await AdminModel.getTotalUsers();

      res.json({
        totalProducts: totalProducts,
        totalOrders: totalOrders,
        totalUsers: totalUsers
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getOrdersChart(req, res) {
    const { year, month } = req.params;

    try {
      const orders = await AdminModel.getOrdersByYearAndMonth(year, month);
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getSalesChart(req, res) {
    const { year, month } = req.params;

    try {
      const salesData = await AdminModel.getSalesDataByYearAndMonth(
        year,
        month
      );
      res.json(salesData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new AdminController();
