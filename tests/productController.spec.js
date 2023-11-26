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

    const mockModel = {
      getAllProducts: jest.fn().mockResolvedValue(mockProducts),
    };

    const productController = new ProductController(mockModel, {});

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await productController.getAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 200, data: mockProducts });
  });

  test("should return a JSON response with a status of 500 when there is an error", async () => {
    const errorMessage = "An error occurred";
    const mockModel = {
      getAllProducts: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    const productController = new ProductController(mockModel, {});

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await productController.getAllProducts(req, res);

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
    const mockModel = {
      getProductById: jest.fn().mockResolvedValue(mockProduct),
    };

    const productController = new ProductController(mockModel, {});

    const req = { params: { id: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await productController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 200, data: mockProduct });
  });

  test("should return a JSON response with a status of 404 when the product is not found", async () => {
    const mockModel = {
      getProductById: jest.fn().mockResolvedValue(null),
    };

    const productController = new ProductController(mockModel, {});

    const req = { params: { id: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await productController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      message: "Produk tidak ditemukan!",
    });
  });

  test("should return a JSON response with a status of 500 when there is an error", async () => {
    const errorMessage = "An error occurred";
    const mockModel = {
      getProductById: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    const productController = new ProductController(mockModel, {});

    const req = { params: { id: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await productController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: errorMessage,
    });
  });
});

// create

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

    const mockModel = {
      createProduct: jest.fn().mockResolvedValue(),
    };

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

    const productController = new ProductController(mockModel, {});

    await productController.createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 201,
      message: "Produk berhasil ditambahkan!",
      name: "ayam geprek",
      description: "Description 1",
      price: 10.0,
      image: "https://example.com/image1.jpg",
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
    const mockModel = {
      createProduct: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    const productController = new ProductController(mockModel, {});

    const cloudinaryService = require("../services/cloudinaryService");
    cloudinaryService.uploadCloudinary = jest.fn();

    const fs = require("fs");
    fs.unlinkSync = jest.fn();

    const req = sampleReq;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await productController.createProduct(req, res);

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

    const mockModel = {
      updateProduct: jest.fn().mockResolvedValue(),
    };

    const productController = new ProductController(mockModel, {});

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

    await productController.updateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 201,
      message: "Produk berhasil diperbarui!",
      product_id: 1,
      name: "Updated Product",
      description: "Updated Description",
      price: 20.0,
      image: "https://example.com/updated_image.jpg",
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
    const mockModel = {
      updateProduct: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    const productController = new ProductController(mockModel, {});

    const cloudinaryService = require("../services/cloudinaryService");
    cloudinaryService.uploadCloudinary = jest.fn();

    const fs = require("fs");
    fs.unlinkSync = jest.fn();

    const req = sampleReq;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await productController.updateProduct(req, res);

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

    const mockModel = {
      deleteProduct: jest.fn().mockResolvedValue(productId),
    };

    const productController = new ProductController(mockModel, {});

    await productController.deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 201,
      id: productId,
      message: "Produk berhasil dihapus!",
    });
  });

  it("should return a JSON response with a status of 500 when an error occurs", async () => {
    const sampleReq = {
      params: { id: 1 },
    };

    const errorMessage = "An error occurred";
    const mockModel = {
      deleteProduct: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    const productController = new ProductController(mockModel, {});

    const req = sampleReq;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await productController.deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: errorMessage,
    });
  });
});
