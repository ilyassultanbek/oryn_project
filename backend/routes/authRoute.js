const authenticate = require("../middleware/authenticate");
const { logout } = require("../controllers/logoutController");
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const requireAdmin = require("../middleware/requireAdmin");

const { register } = require("../controllers/authController");
const { login } = require("../controllers/loginController");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Сұрау тым көп. 15 минуттан кейін қайталаңыз.",
  },
});


// Браузерден жіберілген сұраудың көзін тексереміз.
// PowerShell сұрауында Origin болмауы мүмкін.
router.use((req, res, next) => {
  const allowedOrigin =
    process.env.APP_ORIGIN || "http://localhost:5173";

  if (req.headers.origin && req.headers.origin !== allowedOrigin) {
    return res.status(403).json({
      message: "Бұл сайттан сұрау жіберуге рұқсат жоқ.",
    });
  }

  if (req.method === "POST" && !req.is("application/json")) {
    return res.status(415).json({
      message: "Деректер JSON форматында жіберілуі керек.",
    });
  }

  next();
});

router.post("/register", register);
router.post("/login", login);


router.get("/me", authenticate, (req, res) => {
  res.set("Cache-Control", "no-store");

  res.status(200).json({
    user: req.user,
  });
});


router.post("/logout", authenticate, logout);

router.get(
  "/admin-check",
  authenticate,
  requireAdmin,
  (req, res) => {
    res.set("Cache-Control", "no-store");

    res.status(200).json({
      message: "Әкімші құқығы расталды.",
      user: req.user,
    });
  }
);


module.exports = router;