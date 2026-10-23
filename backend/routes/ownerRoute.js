
const express = require("express");

const authenticate = require("../middleware/authenticate");
const requireAdmin = require("../middleware/requireAdmin");

const {
  getOwners,
  getOwnerParkings,
  promoteOwner,
  assignParkingOwner,
} = require("../controllers/ownerController");

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get("/", getOwners);

router.get("/parkings", getOwnerParkings);

router.patch("/:id/promote", promoteOwner);

router.patch(
  "/parkings/:parkingId",
  assignParkingOwner
);

module.exports = router;
