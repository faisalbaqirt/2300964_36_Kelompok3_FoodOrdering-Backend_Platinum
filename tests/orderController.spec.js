const OrderController = require("../controllers/OrderController");
const db = require("../db/db");

describe("OrderController - getAllOrders", () => {
  test("should return a JSON response with a status of 200 when successful", async () => {
    const mockData = [
      {
        id: 1,
        product_id: 1,
        product_name: "ayam geprek",
        quantity: 5,
        total_amount: 50.0,
        name: "user1",
        telephone: "123-456-7890",
        address: "indonesia",
        status: "Belum Bayar",
      },
      {
        id: 2,
        product_id: 2,
        product_name: "ayam geprek",
        quantity: 3,
        total_amount: 30.0,
        name: "user2",
        telephone: "987-654-3210",
        address: "indonesia",
        status: "Lunas",
      },
    ];

    const mockModel = {
      getAllOrders: jest.fn().mockResolvedValue(mockData),
    };

    const orderController = new OrderController(mockModel, {});

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await orderController.getAllOrders(req, res);

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ data: mockData });
  });

  test("should return a 500 Internal Server Error response when an error occurs", async () => {
    const mockModel = {
      getAllOrders: jest.fn().mockRejectedValue(new Error("Sample error")),
    };

    const orderController = new OrderController(mockModel, {});

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await orderController.getAllOrders(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({ status: 500, message: "Sample error" });
  });
});

describe("OrderController - getOrderById", () => {
  test("should return a JSON response with a status of 200 when data is found", async () => {
    const orderId = 1;
    const mockOrder = {
      id: orderId,
      product_id: 1,
      product_name: "ayam geprek",
      quantity: 5,
      total_amount: 100.0,
      name: "John Doe",
      telephone: "123-456-7890",
      address: "123 Main St",
      status: "Belum Bayar",
    };

    const mockModel = {
      getOrderById: jest.fn().mockResolvedValue(mockOrder),
    };

    const orderController = new OrderController(mockModel, {});

    const req = { params: { id: orderId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await orderController.getOrderById(req, res);

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ data: mockOrder });
  });

  test("should return a JSON response with a status of 404 when data is not found", async () => {
    const orderId = 999;

    const mockModel = {
      getOrderById: jest.fn().mockResolvedValue(null),
    };

    const orderController = new OrderController(mockModel, {});

    const req = { params: { id: orderId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await orderController.getOrderById(req, res);

    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      message: "Data tidak ditemukan!",
    });
  });

  test("should handle errors and return a 500 status with an error message", async () => {
    const orderId = 1;

    const errorMessage = "An error occurred";
    const mockModel = {
      getOrderById: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    const orderController = new OrderController(mockModel, {});

    const req = { params: { id: orderId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await orderController.getOrderById(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      status: 500,
      message: errorMessage,
    });
  });
});

describe("OrderController - createOrder", () => {
  test("should create an order and return a JSON response with a status of 201 when successful", async () => {
    const orderId = 1;
    const requestBody = {
      product_id: 1,
      product_name: "paket ayam geprek",
      quantity: 5,
      name: "John Doe",
      telephone: "123-456-7890",
      address: "123 Main St",
    };

    const req = { body: requestBody };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockModel = {
      createOrder: jest.fn().mockResolvedValue({ id: orderId }),
    };

    const orderController = new OrderController(mockModel, db);
    await orderController.createOrder(req, res);

    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      status: 201,
      message: "Data order berhasil ditambahkan!",
      order_id: { id: orderId },
      product_name: "paket ayam geprek",
      quantity: 5,
      total_amount: 75000,
      name: "John Doe",
      telephone: "123-456-7890",
      address: "123 Main St",
    });
  });

  test("should return a JSON response with a status of 404 when the product is not found", async () => {
    const requestBody = {
      product_name: "Non-existent Product",
      quantity: 5,
      name: "John Doe",
      telephone: "123-456-7890",
      address: "123 Main St",
    };

    const mockModel = {
      createProduct: jest.fn().mockResolvedValue(null),
    };

    const req = { body: requestBody };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const orderController = new OrderController(mockModel, db);
    await orderController.createOrder(req, res);

    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      message: "Produk tidak ditemukan",
    });
  });

  test("should handle errors and return a JSON response with a status of 500 and an error message", async () => {
    const errorMessage =
      "Cannot destructure property 'product_name' of 'req.body' as it is undefined.";
    const mockModel = {
      createOrder: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    const orderController = new OrderController(mockModel, {});

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await orderController.createOrder(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      status: 500,
      message: errorMessage,
    });
  });
});

describe("OrderController - updateOrder", () => {
  test("should update an order and return a JSON response with a status of 201 when successful", async () => {
    const orderId = 1;
    const requestBody = {
      product_name: "ayam geprek",
      quantity: 5,
      name: "John Doe",
      telephone: "123-456-7890",
      address: "123 Main St",
    };

    const mockModel = {
      updateOrder: jest.fn().mockResolvedValue({ id: orderId }),
    };

    const orderController = new OrderController(mockModel, db);

    const req = { params: { id: orderId }, body: requestBody };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await orderController.updateOrder(req, res);

    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      status: 201,
      message: "Data order berhasil diperbarui!",
      order_id: orderId,
      product_name: "ayam geprek",
      quantity: 5,
      total_amount: 60000,
      name: "John Doe",
      telephone: "123-456-7890",
      address: "123 Main St",
    });
  });

  test("should return a JSON response with a status of 404 when the product is not found", async () => {
    const requestBody = {
      product_name: "Non-existent Product",
      quantity: 5,
      name: "John Doe",
      telephone: "123-456-7890",
      address: "123 Main St",
    };

    const mockModel = {
      updateOrder: jest.fn().mockResolvedValue(null),
    };

    const req = { params: { id: 1 }, body: requestBody };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const orderController = new OrderController(mockModel, db);
    await orderController.updateOrder(req, res);

    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      message: "Produk tidak ditemukan",
    });
  });

  test("should handle errors and return a JSON response with a status of 500 and an error message", async () => {
    const errorMessage =
      "Cannot destructure property 'product_name' of 'req.body' as it is undefined.";
    const mockModel = {
      updateOrder: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    const orderController = new OrderController(mockModel, {});

    const req = { params: { id: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await orderController.updateOrder(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      status: 500,
      message: errorMessage,
    });
  });
});

describe("OrderController - updateOrderStatus", () => {
  test("should update the order status and return a JSON response with a status of 200 when successful", async () => {
    const orderId = 1;
    const newStatus = "Dikirim";

    const mockModel = {
      updateOrderStatus: jest.fn().mockResolvedValue(),
    };

    const orderController = new OrderController(mockModel, {});

    const req = { params: { id: orderId }, body: { newStatus } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await orderController.updateOrderStatus(req, res);

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      status: 200,
      message: "Status pesanan berhasil diperbarui!",
    });
  });

  test("should handle errors and return a JSON response with a status of 500 and an error message", async () => {
    const orderId = 1;
    const newStatus = "Dikirim";
    const errorMessage = "Database error";

    const mockModel = {
      updateOrderStatus: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    const orderController = new OrderController(mockModel, {});

    const req = { params: { id: orderId }, body: { newStatus } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await orderController.updateOrderStatus(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      status: 500,
      message: errorMessage,
    });
  });
});

describe("OrderController - deleteOrder", () => {
  test("should delete an order and return a JSON response with a status of 201 when successful", async () => {
    const orderId = 1;

    const mockModel = {
      deleteOrder: jest.fn().mockResolvedValue(orderId),
    };

    const orderController = new OrderController(mockModel, {});

    const req = { params: { id: orderId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await orderController.deleteOrder(req, res);

    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      status: 201,
      message: "Data order berhasil dihapus!",
      id: orderId,
    });
  });

  test("should handle errors and return a JSON response with a status of 500 and an error message", async () => {
    const orderId = 1;
    const errorMessage = "Database error";

    const mockModel = {
      deleteOrder: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    const orderController = new OrderController(mockModel, {});

    const req = { params: { id: orderId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await orderController.deleteOrder(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      status: 500,
      message: errorMessage,
    });
  });
});
