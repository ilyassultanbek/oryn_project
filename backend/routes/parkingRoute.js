const express = require("express");

const authenticate = require("../middleware/authenticate");
const requireAdmin = require("../middleware/requireAdmin");

const {
  getParkings,
  createParking,
  updateParking,
  deleteParking,
} = require("../controllers/parkingController");

const router = express.Router();

// Тұрақтар тізімі барлығына ашық.
router.get("/", getParkings);

// Төмендегі әрекеттер тек кірген әкімшіге қолжетімді.
router.use(authenticate, requireAdmin);

// Cookie арқылы жіберілетін өзгерту сұрауларын қорғаймыз.
router.use((req, res, next) => {
  const allowedOrigin =
    process.env.APP_ORIGIN || "http://localhost:5173";

  if (req.headers.origin !== allowedOrigin) {
    return res.status(403).json({
      message: "Сұрау көзіне рұқсат жоқ.",
    });
  }

  if (
    ["POST", "PUT"].includes(req.method) &&
    !req.is("application/json")
  ) {
    return res.status(415).json({
      message: "Деректер JSON форматында жіберілуі керек.",
    });
  }

  next();
});

router.post("/", createParking);
router.put("/:id", updateParking);
router.delete("/:id", deleteParking);

module.exports = router;