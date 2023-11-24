class OrderController {
  constructor(model, db) {
    this.model = model;
    this.db = db;
  }

  async getAllOrders(req, res) {
    try {
      const data = await this.model.getAllOrders();
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const data = await this.model.getOrderById(req.params.id);
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

      const product = await this.db("products")
        .where("name", product_name)
        .first();
      if (!product) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }
      const total_amount = product.price * quantity;

      const order_id = await this.model.createOrder({
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
        message: "Data order berhasil ditambahkan!",
        order_id: order_id,
        product_name: product.name,
        quantity: quantity,
        total_amount: total_amount,
        name: name,
        telephone: telephone,
        address: address,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async updateOrder(req, res) {
    try {
      const { product_name, quantity, name, telephone, address } = req.body;

      const product = await this.db("products")
        .where("name", product_name)
        .first();
      if (!product) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }
      const total_amount = product.price * quantity;

      await this.model.updateOrder(req.params.id, {
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
        message: "Data order berhasil diperbarui!",
        order_id: req.params.id,
        product_name: product.name,
        quantity: quantity,
        total_amount: total_amount,
        name: name,
        telephone: telephone,
        address: address,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { newStatus } = req.body;

      await this.model.updateOrderStatus(req.params.id, newStatus);

      res
        .status(200)
        .json({ status: 200, message: "Status pesanan berhasil diperbarui!" });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      const id = await this.model.deleteOrder(req.params.id);
      res.status(201).json({
        status: 201,
        id: req.params.id,
        message: "Data order berhasil dihapus!",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
}

module.exports = OrderController;
