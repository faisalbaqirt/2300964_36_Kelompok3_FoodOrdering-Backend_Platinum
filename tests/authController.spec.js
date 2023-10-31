const UserController = require("../controllers/AuthenticationController");
const cloudinaryService = require("../services/cloudinaryService");
const userModel = require("../models/userModel");

describe("UserController - signUp", () => {
  test("should create a new user and return a JSON response with a status of 201 when successful", async () => {
    const randomUsername = `user${Math.floor(Math.random() * 100000)}`;
    const randomEmail = `test${Math.floor(Math.random() * 100000)}@example.com`;

    const req = {
      body: {
        email: randomEmail,
        username: randomUsername,
        password: "testpassword",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await UserController.signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: expect.any(Number),
      username: randomUsername,
      message: "User registration successfully!",
    });
  });

  test("should handle errors and log them", async () => {
    const req = {
      body: {
        email: null,
        username: null,
        password: null,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await UserController.signUp(req, res);
  });
});

describe("UserController - login", () => {
  test("should create a new user and return a JSON response with a status of 201 when successful", async () => {
    const req = {
      body: {
        username: "testuser",
        password: "testpassword",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await UserController.login(req, res);
  });
});

describe("editProfile Function", () => {
  test("should successfully edit the user profile", async () => {
    const req = {
      params: { id: 1 },
      body: {
        username: "newUsername",
        email: "newEmail@example.com",
        name: "New Name",
        password: "newPassword",
      },
      file: { path: "/path/to/uploaded/photo" },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test("should handle errors when editing the user profile", async () => {
    cloudinaryService.uploadCloudinary = jest
      .fn()
      .mockRejectedValue(new Error("Cloudinary error"));

    const req = {
      params: { id: 1 },
      body: {
        username: "newUsername",
        email: "newEmail@example.com",
        name: "New Name",
        password: "newPassword",
      },
      file: { path: "/path/to/uploaded/photo" },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    userModel.editProfile = jest.fn();

    await UserController.editProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Terjadi kesalahan saat mengedit profil",
    });
    expect(userModel.editProfile).not.toHaveBeenCalled();
  });
});

describe("getAllUsers Function", () => {
  test("should return a JSON response with a status of 200 and user data when successful", async () => {
    userModel.getAllUsers = jest.fn().mockResolvedValue([
      { id: 1, username: "user1" },
      { id: 2, username: "user2" },
    ]);

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await UserController.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      data: expect.any(Array),
    });
  });

  test("should return a JSON response with a status of 500 and an error message when an error occurs", async () => {
    userModel.getAllUsers = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await UserController.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: "Database error",
    });
  });
});

describe("getUserById Function", () => {
  test("should return a JSON response with a status of 200 and user data when user is found", async () => {
    userModel.getUserById = jest.fn().mockResolvedValue({
      id: 1,
      username: "user1",
    });

    const req = {
      params: {
        id: 1,
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await UserController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      data: expect.any(Object),
    });
  });

  test('should return a JSON response with a status of 404 and a "User not found" message when user is not found', async () => {
    const req = {
      params: {
        id: 999,
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    userModel.getUserById = jest.fn().mockResolvedValue(null);

    await UserController.getUserById(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      message: "User tidak ditemukan!",
    });
  });

  test("should return a JSON response with a status of 500 and an error message when an error occurs", async () => {
    userModel.getUserById = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    const req = {
      params: {
        id: 1,
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await UserController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: "Database error",
    });
  });
});

describe("deleteUser Function", () => {
  test("should return a JSON response with a status of 201 and a success message when user is deleted", async () => {
    userModel.deleteUser = jest.fn().mockResolvedValue(1);

    const req = {
      params: { id: 1 },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await UserController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 201,
      message: "User berhasil dihapus!",
    });
  });

  test("should return a JSON response with a status of 500 and an error message when user deletion fails", async () => {
    userModel.deleteUser = jest
      .fn()
      .mockRejectedValue(new Error("Deletion error"));

    const req = {
      params: { id: 1 },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await UserController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: "Deletion error",
    });
  });
});
