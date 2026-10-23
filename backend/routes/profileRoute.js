
const express = require("express");
const { rateLimit } = require("express-rate-limit");

const authenticate = require("../middleware/authenticate");

const {
  updateProfile,
  changePassword,
} = require("../controllers/profileController");

const router = express.Router();

const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Құпиясөзді өзгерту әрекеті тым көп. 15 минуттан кейін қайталаңыз.",
  },
});

router.use((req, res, next) => {
  const allowedOrigin =
    process.env.APP_ORIGIN || "http://localhost:5173";

  if (
    req.headers.origin &&
    req.headers.origin !== allowedOrigin
  ) {
    return res.status(403).json({
      message: "Бұл сайттан сұрау жіберуге рұқсат жоқ.",
    });
  }

  if (
    ["POST", "PATCH", "PUT"].includes(req.method) &&
    !req.is("application/json")
  ) {
    return res.status(415).json({
      message: "Деректер JSON форматында жіберілуі керек.",
    });
  }

  next();
});

router.use(authenticate);

router.patch("/", updateProfile);

router.patch(
  "/password",
  passwordLimiter,
  changePassword
);

module.exports = router;
