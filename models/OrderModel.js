class OrderModel {
  constructor(db) {
    this.db = db;
  }

  async getAllOrders() {
    try {
      const data = await this.db.select("*").from("orders");
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getOrderById(id) {
    try {
      const data = await this.db
        .select("*")
        .from("orders")
        .where("id", id)
        .first();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createOrder(orderData) {
    try {
      const [order_id] = await this.db("orders")
        .insert(orderData)
        .returning("id");
      return order_id;
    } catch (error) {
      throw error;
    }
  }

  async updateOrder(id, orderData) {
    try {
      await this.db("orders").where("id", id).update(orderData);
    } catch (error) {
      throw error;
    }
  }

  async updateOrderStatus(id, newStatus) {
    try {
      await this.db("orders").where("id", id).update({ status: newStatus });
    } catch (error) {
      throw error;
    }
  }

  async deleteOrder(id) {
    try {
      const result = await this.db("orders")
        .where("id", id)
        .delete()
        .returning("id");
      return result[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderModel;
