const ProductModel = require("../models/ProductModel");
const cloudinaryService = require("../services/cloudinaryService");
const fs = require("fs");

class ProductController {
  async getAllProducts(req, res) {
    try {
      const data = await ProductModel.getAllProducts();
      res.status(200).json({ status: 200, data });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const data = await ProductModel.getProductById(req.params.id);
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

      // upload gambar ke Cloudinary ke dalam folder 'products'
      const folderName = "products";
      const imageURL = await cloudinaryService.uploadCloudinary(
        image,
        folderName
      );

      fs.unlinkSync(image);
      // menyimpan data produk ke database
      await ProductModel.createProduct({
        name,
        description,
        price,
        image: imageURL,
      });

      res.status(201).json({
        status: 201,
        message: "Produk berhasil ditambahkan!",
        imageURL,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { name, description, price } = req.body;
      const image = req.file.path;

      // upload gambar ke Cloudinary ke dalam folder 'products'
      const folderName = "products";
      const imageURL = await cloudinaryService.uploadCloudinary(
        image,
        folderName
      );

      fs.unlinkSync(image);
      await ProductModel.updateProduct(
        req.params.id,
        name,
        description,
        price,
        imageURL
      );

      res
        .status(201)
        .json({ status: 201, message: "Produk berhasil diperbarui!" });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const id = await ProductModel.deleteProduct(req.params.id);
      res
        .status(201)
        .json({ status: 201, message: "Produk berhasil dihapus!" });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
}

module.exports = new ProductController();
