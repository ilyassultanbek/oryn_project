
const express = require("express");

const authenticate = require("../middleware/authenticate");
const requireAdmin = require("../middleware/requireAdmin");

const {
  getNotifications,
  createNotification,
  updateNotification,
  setNotificationPublished,
  deleteNotification,
  getPublicNotifications,
} = require("../controllers/adminNotificationsController");

const adminRouter = express.Router();
const publicRouter = express.Router();

// Кэштеуді өшіру
function noCache(req, res, next) {
  res.set("Cache-Control", "no-store");
  next();
}

// Жазу сұраныстарын қорғау
function validateWriteRequest(req, res, next) {
  const allowedOrigin =
    process.env.APP_ORIGIN || "http://localhost:5173";

  if (req.headers.origin !== allowedOrigin) {
    return res.status(403).json({
      message: "Сұрау көзіне рұқсат жоқ.",
    });
  }

  if (
    req.method !== "DELETE" &&
    !req.is("application/json")
  ) {
    return res.status(415).json({
      message: "JSON форматы қажет.",
    });
  }

  next();
}

// ADMIN: барлық маршрут қорғалған
adminRouter.use(noCache, authenticate, requireAdmin);

// Барлығын алу
adminRouter.get("/", getNotifications);

// Жаңа хабарландыру
adminRouter.post(
  "/",
  validateWriteRequest,
  createNotification
);

// Өңдеу
adminRouter.patch(
  "/:id",
  validateWriteRequest,
  updateNotification
);

// Жариялау немесе жасыру
adminRouter.patch(
  "/:id/publish",
  validateWriteRequest,
  setNotificationPublished
);

// Жою
adminRouter.delete(
  "/:id",
  validateWriteRequest,
  deleteNotification
);

// PUBLIC: тек жарияланған жалпы хабарландырулар
publicRouter.get(
  "/",
  noCache,
  getPublicNotifications
);

module.exports = {
  adminRouter,
  publicRouter,
};
