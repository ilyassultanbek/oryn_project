
const express = require("express");

const authenticate = require("../middleware/authenticate");
const requireAdmin = require("../middleware/requireAdmin");

const {
  getAnalytics,
} = require("../controllers/adminAnalyticsController");

const router = express.Router();

// Тек авторизацияланған әкімші кіре алады
router.use(authenticate, requireAdmin);

// GET /api/v1/admin/analytics
router.get("/", getAnalytics);

module.exports = router;
