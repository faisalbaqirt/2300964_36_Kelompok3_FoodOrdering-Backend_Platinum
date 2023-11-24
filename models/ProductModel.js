class ProductModel {
  constructor(db) {
    this.db = db;
  }

  async getAllProducts() {
    try {
      const data = await this.db.select("*").from("products");
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const data = await this.db
        .select("*")
        .from("products")
        .where("id", id)
        .first();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createProduct(data) {
    try {
      await this.db("products").insert(data);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, name, description, price, image) {
    try {
      await this.db("products").where("id", id).update({
        name: name,
        description: description,
        price: price,
        image: image,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const result = await this.db("products")
        .where("id", id)
        .delete()
        .returning("id");
      return result[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductModel;
