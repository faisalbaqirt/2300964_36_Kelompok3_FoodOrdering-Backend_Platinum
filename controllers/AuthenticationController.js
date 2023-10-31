const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "b36709837c301f474a0199f4c4b4e82e";
const cloudinaryService = require("../services/cloudinaryService");
const fs = require("fs");

const signUp = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const encryptedPassword = bcrypt.hashSync(password.toString(), 10);
    const user = await userModel.registerUser(
      username,
      email,
      encryptedPassword
    );
    res.status(201).json({
      id: user[0].id,
      username: user[0].username,
      message: "User registration successfully!",
    });
  } catch (error) {
    console.error(error);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.loginByUsername(username);

    if (!user) {
      return res.json({ message: "user not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password.toString(),
      user.password
    );
    if (!isPasswordValid) {
      return res.json({ message: "Wrong Password" });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      secretKey
    );

    return res.status(200).json({
      id: user.id,
      username: user.username,
      role: user.role,
      accessToken: accessToken,
    });
  } catch (error) {
    console.error(error);
  }
};

const profile = (req, res) => {
  res.json(req.user);
};

const editProfile = async (req, res) => {
  try {
    const { username, email, name, password } = req.body;
    const photo = req.file.path;

    const encryptedPassword = bcrypt.hashSync(password.toString(), 10);

    // upload gambar ke Cloudinary ke dalam folder 'users'
    const folderName = "users";
    const photoURL = await cloudinaryService.uploadCloudinary(
      photo,
      folderName
    );

    fs.unlinkSync(photo);

    await userModel.editProfile(
      req.params.id,
      username,
      email,
      name,
      encryptedPassword,
      photoURL
    );

    res.status(201).json({ message: "Profil berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mengedit profil" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const data = await userModel.getAllUsers();
    res.status(200).json({ status: 200, data });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const getAllUsersData = async (req, res) => {
  try {
    const data = await userModel.getAllUsers();
    const filteredData = data.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    }));

    res.status(200).json({ status: 200, data: filteredData });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const data = await userModel.getUserById(req.params.id);
    if (!data) {
      return res
        .status(404)
        .json({ status: 404, message: "User tidak ditemukan!" });
    }

    const filteredData = {
      id: data.id,
      username: data.username,
      name: data.name,
      role: data.role,
    };

    res.status(200).json({ status: 200, data: filteredData });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const createUserByAdmin = async (req, res) => {
  try {
    const { username, email, name, password, role } = req.body;
    const photo = req.file.path;

    const encryptedPassword = bcrypt.hashSync(password.toString(), 10);

    // upload gambar ke Cloudinary ke dalam folder 'users'
    const folderName = "users";
    const photoURL = await cloudinaryService.uploadCloudinary(
      photo,
      folderName
    );

    fs.unlinkSync(photo);

    await userModel.createUserByAdmin(
      username,
      email,
      name,
      encryptedPassword,
      photoURL,
      role
    );

    res.status(201).json({ message: "Berhasil menambahkan user" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menambahkan user" });
  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const { username, email, name, password, role } = req.body;
    const photo = req.file.path;

    const encryptedPassword = bcrypt.hashSync(password.toString(), 10);

    // upload gambar ke Cloudinary ke dalam folder 'users'
    const folderName = "users";
    const photoURL = await cloudinaryService.uploadCloudinary(
      photo,
      folderName
    );

    fs.unlinkSync(photo);

    await userModel.updateUserByAdmin(
      req.params.id,
      username,
      email,
      name,
      encryptedPassword,
      photoURL,
      role
    );

    res.status(201).json({ message: "Profil berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mengedit profil" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = await userModel.deleteUser(req.params.id);
    res.status(201).json({ status: 201, message: "User berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = {
  signUp,
  login,
  profile,
  editProfile,
  getAllUsers,
  getAllUsersData,
  getUserById,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUser,
};
