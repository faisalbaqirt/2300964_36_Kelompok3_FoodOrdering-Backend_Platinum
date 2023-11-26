const cloudinaryService = require("../services/cloudinaryService");
const fs = require("fs");

class ProductController {
  constructor(model, db) {
    this.model = model;
    this.db = db;
  }

  setFolderName(req) {
    const isSimulation =
      req.originalUrl && req.originalUrl.includes("/simulation/products");
    return isSimulation ? "product-simulation" : "products";
  }

  async getAllProducts(req, res) {
    try {
      const data = await this.model.getAllProducts();
      res.status(200).json({ status: 200, data });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const data = await this.model.getProductById(req.params.id);
      if (!data) {
        res
          .status(404)
          .json({ status: 404, message: "Produk tidak ditemukan!" });
      }
      res.status(200).json({ status: 200, data });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const { name, description, price } = req.body;
      const image = req.file.path;

      // upload gambar ke Cloudinary
      const folderName = this.setFolderName(req);
      const imageURL = await cloudinaryService.uploadCloudinary(
        image,
        folderName
      );

      fs.unlinkSync(image);
      // menyimpan data produk ke database
      await this.model.createProduct({
        name,
        description,
        price,
        image: imageURL,
      });

      res.status(201).json({
        status: 201,
        message: "Produk berhasil ditambahkan!",
        name: name,
        description: description,
        price: price,
        image: imageURL,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { name, description, price } = req.body;
      const image = req.file.path;

      // upload gambar ke Cloudinary
      const folderName = this.setFolderName(req);
      const imageURL = await cloudinaryService.uploadCloudinary(
        image,
        folderName
      );

      fs.unlinkSync(image);
      await this.model.updateProduct(
        req.params.id,
        name,
        description,
        price,
        imageURL
      );

      res.status(201).json({
        status: 201,
        message: "Produk berhasil diperbarui!",
        product_id: req.params.id,
        name: name,
        description: description,
        price: price,
        image: imageURL,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const id = await this.model.deleteProduct(req.params.id);
      res.status(201).json({
        status: 201,
        id: req.params.id,
        message: "Produk berhasil dihapus!",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
}

module.exports = ProductController;
