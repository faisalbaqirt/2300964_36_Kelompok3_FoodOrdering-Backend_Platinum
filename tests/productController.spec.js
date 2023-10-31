const ProductModel = require("../models/ProductModel");
const ProductController = require("../controllers/ProductController");

describe("ProductController - getAllProducts", () => {
  test("should return a JSON response with a status of 200 when successful", async () => {
    const mockProducts = [
      {
        id: 1,
        name: "ayam geprek",
        description: "Description 1",
        price: 10.0,
        image:
          "https://res.cloudinary.com/dg1vhnf5g/image/upload/v1697878704/products/ayamgeprek1_n7o1rv.jpg",
      },
      {
        id: 2,
        name: "ayam geprek",
        description: "Description 2",
        price: 15.0,
        image:
          "https://res.cloudinary.com/dg1vhnf5g/image/upload/v1697878704/products/ayamgeprek1_n7o1rv.jpg",
      },
    ];

    ProductModel.getAllProducts = jest.fn().mockResolvedValue(mockProducts);

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await ProductController.getAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 200, data: mockProducts });
  });

  test("should return a JSON response with a status of 500 when there is an error", async () => {
    const errorMessage = "An error occurred";
    ProductModel.getAllProducts = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await ProductController.getAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: errorMessage,
    });
  });
});

// get by id
describe("ProductController - getProductById", () => {
  test("should return a JSON response with a status of 200 when the product is found", async () => {
    const mockProduct = {
      id: 1,
      name: "ayam geprek",
      description: "Description 1",
      price: 10.0,
      image:
        "https://res.cloudinary.com/dg1vhnf5g/image/upload/v1697878704/products/ayamgeprek1_n7o1rv.jpg",
    };
    ProductModel.getProductById = jest.fn().mockResolvedValue(mockProduct);

    const req = { params: { id: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await ProductController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 200, data: mockProduct });
  });

  test("should return a JSON response with a status of 404 when the product is not found", async () => {
    ProductModel.getProductById = jest.fn().mockResolvedValue(null);

    const req = { params: { id: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await ProductController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      message: "Produk tidak ditemukan!",
    });
  });

  test("should return a JSON response with a status of 500 when there is an error", async () => {
    const errorMessage = "An error occurred";
    ProductModel.getProductById = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    const req = { params: { id: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await ProductController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: errorMessage,
    });
  });
});

describe("ProductController - createProduct", () => {
  test("should create a new product and return a JSON response with a status of 201 when successful", async () => {
    const sampleReq = {
      body: {
        name: "ayam geprek",
        description: "Description 1",
        price: 10.0,
      },
      file: {
        path: "/path/to/image1.jpg",
      },
    };

    ProductModel.createProduct = jest.fn().mockResolvedValue();

    const sampleImageURL = "https://example.com/image1.jpg";
    const cloudinaryService = require("../services/cloudinaryService");
    cloudinaryService.uploadCloudinary = jest
      .fn()
      .mockResolvedValue(sampleImageURL);

    const fs = require("fs");
    fs.unlinkSync = jest.fn();

    const req = sampleReq;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await ProductController.createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 201,
      message: "Produk berhasil ditambahkan!",
      imageURL: sampleImageURL,
    });
  });

  test("should return a JSON response with a status of 500 when an error occurs", async () => {
    const sampleReq = {
      body: {
        name: "ayam geprek",
        description: "Description 1",
        price: 10.0,
      },
      file: {
        path: "/path/to/image1.jpg",
      },
    };

    const errorMessage = "An error occurred";
    ProductModel.createProduct = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    const cloudinaryService = require("../services/cloudinaryService");
    cloudinaryService.uploadCloudinary = jest.fn();

    const fs = require("fs");
    fs.unlinkSync = jest.fn();

    const req = sampleReq;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await ProductController.createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: errorMessage,
    });
  });
});

// updateProduct
describe("ProductController - updateProduct", () => {
  test("should update an existing product and return a JSON response with a status of 201 when successful", async () => {
    const sampleReq = {
      params: { id: 1 },
      body: {
        name: "Updated Product",
        description: "Updated Description",
        price: 20.0,
      },
      file: {
        path: "/path/to/updated_image.jpg",
      },
    };

    ProductModel.updateProduct = jest.fn().mockResolvedValue();

    const sampleImageURL = "https://example.com/updated_image.jpg";
    const cloudinaryService = require("../services/cloudinaryService");
    cloudinaryService.uploadCloudinary = jest
      .fn()
      .mockResolvedValue(sampleImageURL);

    const fs = require("fs");
    fs.unlinkSync = jest.fn();

    const req = sampleReq;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await ProductController.updateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 201,
      message: "Produk berhasil diperbarui!",
    });
  });

  test("should return a JSON response with a status of 500 when an error occurs", async () => {
    const sampleReq = {
      params: { id: 1 },
      body: {
        name: "Updated Product",
        description: "Updated Description",
        price: 20.0,
      },
      file: {
        path: "/path/to/updated_image.jpg",
      },
    };

    const errorMessage = "An error occurred";
    ProductModel.updateProduct = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    const cloudinaryService = require("../services/cloudinaryService");
    cloudinaryService.uploadCloudinary = jest.fn();

    const fs = require("fs");
    fs.unlinkSync = jest.fn();

    const req = sampleReq;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await ProductController.updateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: errorMessage,
    });
  });
});

// test deleteProducts
describe("ProductController - deleteProduct", () => {
  test("should delete an existing product and return a JSON response with a status of 201 when successful", async () => {
    const productId = 1;

    const req = { params: { id: productId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    ProductModel.deleteProduct = jest.fn().mockResolvedValue(productId);

    await ProductController.deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 201,
      message: "Produk berhasil dihapus!",
    });
  });

  it("should return a JSON response with a status of 500 when an error occurs", async () => {
    const sampleReq = {
      params: { id: 1 },
    };

    const errorMessage = "An error occurred";
    ProductModel.deleteProduct = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    const req = sampleReq;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await ProductController.deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: errorMessage,
    });
  });
});
