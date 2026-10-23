
const express = require("express");

const authenticate = require("../middleware/authenticate");
const requireAdmin = require("../middleware/requireAdmin");

const {
  getUsers,
  getUserStats,
  updateUserRole,
} = require("../controllers/userController");

const router = express.Router();

// Барлық маршрутқа авторизация қажет.
router.use(authenticate, requireAdmin);

router.get("/", getUsers);

router.get("/stats", getUserStats);

router.patch("/:id/role", updateUserRole);

module.exports = router;
