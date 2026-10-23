
const express = require("express");

const authenticate = require("../middleware/authenticate");
const requireAdmin = require("../middleware/requireAdmin");

const {
  getOccupancy,
  updateOccupancy,
} = require("../controllers/occupancyController");

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get("/", getOccupancy);
router.patch("/:id", updateOccupancy);

module.exports = router;
