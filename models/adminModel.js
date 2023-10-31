const db = require("../db/db");

class AdminModel {
  async getTotalProducts() {
    const totalProducts = await db("products").count();
    return totalProducts[0].count;
  }

  async getTotalOrders() {
    const totalOrders = await db("orders").count();
    return totalOrders[0].count;
  }

  async getTotalUsers() {
    const totalUsers = await db("users").count();
    return totalUsers[0].count;
  }

  async getOrdersByYearAndMonth(year, month) {
    return db("orders")
      .where(db.raw("EXTRACT(YEAR FROM created_at) = ?", [year]))
      .where(db.raw("EXTRACT(MONTH FROM created_at) = ?", [month]));
  }

  async getSalesDataByYearAndMonth(year, month) {
    return db("orders")
      .where(db.raw("EXTRACT(MONTH FROM created_at) = ?", [month]))
      .where(db.raw("EXTRACT(YEAR FROM created_at) = ?", [year]))
      .where("status", "Sudah Bayar")
      .sum("total_amount as total_sales")
      .first();
  }
}

module.exports = new AdminModel()