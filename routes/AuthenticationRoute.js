const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthenticationController");
const isAuthenticated = require("../middleware/isAuthenticated");
const checkRole = require("../middleware/roleAccess");
const upload = require("../middleware/multer");

router.post("/register", authController.signUp);
router.post("/login", authController.login);
router.get("/profile", isAuthenticated, authController.profile);
router.put(
  "/profile/:id",
  isAuthenticated,
  upload.single("photo"),
  authController.editProfile
);
router.get("/users", authController.getAllUsersData);
router.get("/users/:id", authController.getUserById);
router.get("/user", authController.getAllUsers);
router.post(
  "/user",
  isAuthenticated,
  checkRole,
  upload.single("photo"),
  authController.createUserByAdmin
);
router.put(
  "/user/:id",
  isAuthenticated,
  checkRole,
  upload.single("photo"),
  authController.updateUserByAdmin
);
router.delete("/user/:id", authController.deleteUser);

module.exports = router;
