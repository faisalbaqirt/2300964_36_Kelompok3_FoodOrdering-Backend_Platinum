const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "b36709837c301f474a0199f4c4b4e82e";
const cloudinaryService = require("../services/cloudinaryService");
const fs = require("fs");

class AuthenticationController {
  constructor(model, db) {
    this.model = model;
    this.db = db;
  }

  setFolderName(req) {
    const isSimulation = req.originalUrl.includes("/simulation/profile");
    return isSimulation ? "user-simulation" : "users";
  }

  async signUp(req, res) {
    try {
      const { email, username, password } = req.body;

      const encryptedPassword = bcrypt.hashSync(password.toString(), 10);
      const user = await this.model.registerUser(
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
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await this.model.loginByUsername(username);

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
  }

  profile(req, res) {
    res.json(req.user);
  }

  async editProfile(req, res) {
    try {
      const { username, email, name, password } = req.body;
      const photo = req.file.path;

      const encryptedPassword = bcrypt.hashSync(password.toString(), 10);

      // upload gambar ke Cloudinary
      const folderName = this.setFolderName(req);
      const photoURL = await cloudinaryService.uploadCloudinary(
        photo,
        folderName
      );

      fs.unlinkSync(photo);

      await this.model.editProfile(
        req.params.id,
        username,
        email,
        name,
        encryptedPassword,
        photoURL
      );

      res
        .status(201)
        .json({
          message: "Profil berhasil diperbarui",
          id: req.params.id,
          username: username,
          email: email,
          name: name,
          photo: photoURL,
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengedit profil" });
    }
  }

  async getAllUsers(req, res) {
    try {
      const data = await this.model.getAllUsers();
      res.status(200).json({ status: 200, data });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async getAllUsersData(req, res) {
    try {
      const data = await this.model.getAllUsers();
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
  }

  async getUserById(req, res) {
    try {
      const data = await this.model.getUserById(req.params.id);
      if (!data) {
        return res
          .status(404)
          .json({ status: 404, message: "User tidak ditemukan!" });
      }

      res.status(200).json({
        status: 200,
        id: data.id,
        username: data.username,
        name: data.name,
        role: data.role,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async createUserByAdmin(req, res) {
    try {
      const { username, email, name, password, role } = req.body;
      const photo = req.file.path;

      const encryptedPassword = bcrypt.hashSync(password.toString(), 10);

      // upload gambar ke Cloudinary ke dalam folder 'users'
      const folderName = this.setFolderName(req);
      const photoURL = await cloudinaryService.uploadCloudinary(
        photo,
        folderName
      );

      fs.unlinkSync(photo);

      await this.model.createUserByAdmin(
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
  }

  async updateUserByAdmin(req, res) {
    try {
      const { username, email, name, password, role } = req.body;
      const photo = req.file.path;

      const encryptedPassword = bcrypt.hashSync(password.toString(), 10);

      // upload gambar ke Cloudinary ke dalam folder 'users'
      const folderName = this.setFolderName(req);
      const photoURL = await cloudinaryService.uploadCloudinary(
        photo,
        folderName
      );

      fs.unlinkSync(photo);

      await this.model.updateUserByAdmin(
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
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengedit profil" });
    }
  }

  async deleteUser(req, res) {
    try {
      const id = await this.model.deleteUser(req.params.id);
      res.status(201).json({
        status: 201,
        id: req.params.id,
        message: "User berhasil dihapus!",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
}

module.exports = AuthenticationController;
