const express = require("express");

const authenticate = require("../middleware/authenticate");

const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");

const router = express.Router();

router.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Таңдаулылар тек жүйеге кірген қолданушыға қолжетімді.
router.use(authenticate);

router.get("/", getFavorites);

// Деректерді өзгертетін сұраныстардың көзін тексереміз.
router.use((req, res, next) => {
  const allowedOrigin =
    process.env.APP_ORIGIN || "http://localhost:5173";

  if (req.get("Origin") !== allowedOrigin) {
    return res.status(403).json({
      message: "Бұл сұраныс көзіне рұқсат жоқ.",
    });
  }

  next();
});

router.put("/:parkingId", addFavorite);
router.delete("/:parkingId", removeFavorite);

module.exports = router;