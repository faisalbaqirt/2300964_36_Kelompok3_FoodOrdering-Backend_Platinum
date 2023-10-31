const db = require("../db/db");
const OrderModel = require("../models/OrderModel");

class OrderController {
  async getAllOrders(req, res) {
    try {
      const data = await OrderModel.getAllOrders();
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const data = await OrderModel.getOrderById(req.params.id);
      if (!data) {
        res.status(404).json({ message: "Data tidak ditemukan!" });
      }
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async createOrder(req, res) {
    try {
      const { product_name, quantity, name, telephone, address } = req.body;

      const product = await db("products").where("name", product_name).first();
      if (!product) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }
      const total_amount = product.price * quantity;

      const order_id = await OrderModel.createOrder({
        product_id: product.id,
        product_name: product.name,
        quantity: quantity,
        total_amount: total_amount,
        name: name,
        telephone: telephone,
        address: address,
      });

      res.status(201).json({
        status: 201,
        order_id: order_id,
        message: "Data order berhasil ditambahkan!",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async updateOrder(req, res) {
    try {
      const { product_name, quantity, name, telephone, address } = req.body;

      const product = await db("products").where("name", product_name).first();
      if (!product) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }
      const total_amount = product.price * quantity;

      await OrderModel.updateOrder(req.params.id, {
        product_id: product.id,
        product_name: product.name,
        quantity: quantity,
        total_amount: total_amount,
        name: name,
        telephone: telephone,
        address: address,
      });

      res
        .status(201)
        .json({ status: 201, message: "Data order berhasil diperbarui!" });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { newStatus } = req.body;

      await OrderModel.updateOrderStatus(req.params.id, newStatus);

      res
        .status(200)
        .json({ status: 200, message: "Status pesanan berhasil diperbarui!" });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      const id = await OrderModel.deleteOrder(req.params.id);
      res.status(201).json({
        status: 201,
        message: "Data order berhasil dihapus!",
        deletedOrderId: id,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
}

module.exports = new OrderController();
