const UserController = require("../controllers/AuthenticationController");

describe("UserController - signUp", () => {
  test("should create a new user and return a JSON response with a status of 201 when successful", async () => {
    const requestBody = {
      username: "usertesting",
      email: "user@testing.com",
      password: "testpassword",
    };

    const req = { body: requestBody };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockModel = {
      registerUser: jest
        .fn()
        .mockResolvedValue([{ id: 1, username: "usertesting" }]),
    };

    const userController = new UserController(mockModel, {});

    await userController.signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      username: "usertesting",
      message: "User registration successfully!",
    });
  });

  test("should handle errors and return a JSON response with a status of 500 and an error message", async () => {
    const errorMessage = "Terjadi kesalahan saat mendaftarkan pengguna";
    const mockModel = {
      registerUser: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    const userController = new UserController(mockModel, {});

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await userController.signUp(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      message: errorMessage,
    });
  });
});

describe("UserController - login", () => {
  test("should return user data and access token when login is successful", async () => {
    const requestBody = {
      username: "usertesting",
      password: "testpassword",
    };

    const req = { body: requestBody };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockModel = {
      loginByUsername: jest.fn().mockResolvedValue({
        id: 1,
        username: "usertesting",
        role: "user",
      }),
    };

    const bcrypt = require("bcrypt");
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    const jwt = require("jsonwebtoken");
    jwt.sign = jest.fn().mockReturnValue("mockedAccessToken");

    const userController = new UserController(mockModel, {});

    await userController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      username: "usertesting",
      role: "user",
      accessToken: "mockedAccessToken",
    });
  });

  test("should return 'user not found' when user does not exist", async () => {
    const req = {
      body: {
        username: "nonexistentuser",
        password: "somepassword",
      },
    };

    const res = {
      json: jest.fn(),
    };

    const mockModel = {
      loginByUsername: jest.fn().mockResolvedValue(null),
    };

    const userController = new UserController(mockModel, {});

    await userController.login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "user not found",
    });
  });

  test("should return 'Wrong Password' when password is incorrect", async () => {
    const req = {
      body: {
        username: "testuser",
        password: "wrongpassword",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockModel = {
      loginByUsername: jest.fn().mockResolvedValue({
        id: 1,
        username: "testuser",
        role: "user",
        password: "$2b$10$somehash",
      }),
    };

    const bcrypt = require("bcrypt");
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    const userController = new UserController(mockModel, {});

    await userController.login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Wrong Password",
    });
  });

  test("should handle errors and log them", async () => {
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

    const mockModel = {
      loginByUsername: jest.fn().mockRejectedValue(new Error("Login failed")),
    };

    const userController = new UserController(mockModel, {});

    await userController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login failed",
    });
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

    const mockModel = {
      editProfile: jest.fn().mockResolvedValue({ id: 1 }),
    };

    const userController = new UserController(mockModel, {});

    const sampleImageURL = "https://example.com/updated_image.jpg";
    const cloudinaryService = require("../services/cloudinaryService");
    cloudinaryService.uploadCloudinary = jest
      .fn()
      .mockResolvedValue(sampleImageURL);

    const fs = require("fs");
    fs.unlinkSync = jest.fn();

    await userController.editProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Profil berhasil diperbarui",
      id: 1,
      username: "newUsername",
      email: "newEmail@example.com",
      name: "New Name",
      photo: "https://example.com/updated_image.jpg",
    });
  });

  test("should handle errors when editing the user profile", async () => {
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

    const errorMessage = "An error occurred";
    const mockModel = {
      editProfile: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    const userController = new UserController(mockModel, {});

    const cloudinaryService = require("../services/cloudinaryService");
    cloudinaryService.uploadCloudinary = jest.fn();

    const fs = require("fs");
    fs.unlinkSync = jest.fn();

    await userController.editProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Terjadi kesalahan saat mengedit profil",
    });
  });
});

describe("getAllUsers Function", () => {
  test("should return a JSON response with a status of 200 and user data when successful", async () => {
    const mockUser = [
      { id: 1, username: "user1" },
      { id: 2, username: "user2" },
    ];

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockModel = {
      getAllUsers: jest.fn().mockResolvedValue(mockUser),
    };

    const userController = new UserController(mockModel, {});

    await userController.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      data: expect.any(Array),
    });
  });

  test("should return a JSON response with a status of 500 and an error message when an error occurs", async () => {
    const mockModel = {
      getAllUsers: jest.fn().mockRejectedValue(new Error("Database error")),
    };
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userController = new UserController(mockModel, {});

    await userController.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: "Database error",
    });
  });
});

describe("getUserById Function", () => {
  test("should return a JSON response with a status of 200 and user data when user is found", async () => {
    const mockModel = {
      getUserById: jest.fn().mockResolvedValue({
        id: 1,
        username: "user1",
        name: "user1",
        role: "user",
      }),
    };
    const req = {
      params: {
        id: 1,
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const userController = new UserController(mockModel, {});

    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      id: 1,
      username: "user1",
      name: "user1",
      role: "user",
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

    const mockModel = {
      getUserById: jest.fn().mockResolvedValue(null),
    };

    const userController = new UserController(mockModel, {});

    await userController.getUserById(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      message: "User tidak ditemukan!",
    });
  });

  test("should return a JSON response with a status of 500 and an error message when an error occurs", async () => {
    const mockModel = {
      getUserById: jest.fn().mockRejectedValue(new Error("Database error")),
    };

    const req = {
      params: {
        id: 1,
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const userController = new UserController(mockModel, {});

    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: "Database error",
    });
  });
});

describe("deleteUser Function", () => {
  test("should return a JSON response with a status of 201 and a success message when user is deleted", async () => {
    const mockModel = {
      deleteUser: jest.fn().mockResolvedValue(1),
    };

    const req = {
      params: { id: 1 },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const userController = new UserController(mockModel, {});

    await userController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 201,
      id: 1,
      message: "User berhasil dihapus!",
    });
  });

  test("should return a JSON response with a status of 500 and an error message when user deletion fails", async () => {
    const mockModel = {
      deleteUser: jest.fn().mockRejectedValue(new Error("Deletion error")),
    };

    const req = {
      params: { id: 1 },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const userController = new UserController(mockModel, {});

    await userController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: "Deletion error",
    });
  });
});
