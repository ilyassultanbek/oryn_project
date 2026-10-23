
const express = require("express");
const { rateLimit } = require("express-rate-limit");

const authenticate = require("../middleware/authenticate");
const requireAdmin = require("../middleware/requireAdmin");

const {
  createMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
} = require("../controllers/messageController");

const router = express.Router();

// Хабарлама жіберуге шектеу
const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Хабарлама жіберу шегіне жеттіңіз. 15 минуттан кейін қайталаңыз.",
  },
});

// POST, PATCH, DELETE сұрауларын тексеру
function validateWriteRequest(req, res, next) {
  const allowedOrigin =
    process.env.APP_ORIGIN || "http://localhost:5173";

  // Сұрау рұқсат етілген Frontend-тен келуі керек
  if (req.headers.origin !== allowedOrigin) {
    return res.status(403).json({
      message: "Сұрау көзіне рұқсат жоқ.",
    });
  }

  // DELETE сұрауында JSON body қажет емес
  if (req.method === "DELETE") {
    return next();
  }

  // POST және PATCH үшін JSON міндетті
  if (!req.is("application/json")) {
    return res.status(415).json({
      message: "Деректер JSON форматында жіберілуі керек.",
    });
  }

  next();
}

// Кэштеуді өшіру
router.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// POST /api/v1/messages
// Қолданушы хабарлама жібереді
router.post(
  "/",
  messageLimiter,
  validateWriteRequest,
  createMessage
);

// GET /api/v1/messages
// Хабарламаларды тек әкімші көреді
router.get(
  "/",
  authenticate,
  requireAdmin,
  getMessages
);

// PATCH /api/v1/messages/:id/status
// Әкімші хабарлама статусын өзгертеді
router.patch(
  "/:id/status",
  authenticate,
  requireAdmin,
  validateWriteRequest,
  updateMessageStatus
);

// DELETE /api/v1/messages/:id
// Әкімші хабарламаны жояды
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  validateWriteRequest,
  deleteMessage
);

module.exports = router;
