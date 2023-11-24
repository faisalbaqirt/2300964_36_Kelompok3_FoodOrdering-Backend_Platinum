const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const checkRole = require("../middleware/roleAccess");
const upload = require("../middleware/multer");
const AuthenticationController = require("../controllers/AuthenticationController");
const UserModel = require("../models/userModel");
const db = require("../db/db");

const authController = new AuthenticationController(new UserModel(db), db);

router.post("/register", authController.signUp.bind(authController));
router.post("/login", authController.login.bind(authController));
router.get("/profile", isAuthenticated, authController.profile.bind(authController));
router.put(
  "/profile/:id",
  isAuthenticated,
  upload.single("photo"),
  authController.editProfile.bind(authController)
);
router.get("/users", authController.getAllUsersData.bind(authController));
router.get("/users/:id", authController.getUserById.bind(authController));
router.get("/user", authController.getAllUsers.bind(authController));
router.post(
  "/user",
  isAuthenticated,
  checkRole,
  upload.single("photo"),
  authController.createUserByAdmin.bind(authController)
);
router.put(
  "/user/:id",
  isAuthenticated,
  checkRole,
  upload.single("photo"),
  authController.updateUserByAdmin.bind(authController)
);
router.delete("/user/:id", authController.deleteUser.bind(authController));

module.exports = router;
