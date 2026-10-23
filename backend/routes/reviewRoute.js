
const express = require("express");

const {
  getParkingReviews,
  getParkingRating,
  getParkingRatings,
  createReview,
  getMyReviews,
  updateMyReview,
  deleteMyReview,
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewController");

// Authentication middleware
const authModule = require("../middleware/authenticate");
const adminModule = require("../middleware/requireAdmin");

// Support default and named CommonJS exports
const authenticate =
  authModule.authenticate ??
  authModule.default ??
  authModule;

const requireAdmin =
  adminModule.requireAdmin ??
  adminModule.default ??
  adminModule;

// Validate middleware
if (
  typeof authenticate !== "function" ||
  typeof requireAdmin !== "function"
) {
  throw new Error(
    "Review routes: authentication middleware экспорты дұрыс емес."
  );
}

const router = express.Router();

// =====================================
// PUBLIC ROUTES
// =====================================

// Барлық тұрақтардың рейтингтері
router.get(
  "/ratings",
  getParkingRatings
);

// Бір тұрақтың орташа рейтингі
router.get(
  "/parking/:parkingId/rating",
  getParkingRating
);

// Тұрақтың мақұлданған пікірлері
router.get(
  "/parking/:parkingId",
  getParkingReviews
);

// =====================================
// AUTHENTICATED USER ROUTES
// =====================================

// Жаңа пікір қалдыру
router.post(
  "/parking/:parkingId",
  authenticate,
  createReview
);

// Өз пікірлерін алу
router.get(
  "/me",
  authenticate,
  getMyReviews
);

// Өз пікірін өңдеу
router.patch(
  "/me/:id",
  authenticate,
  updateMyReview
);

// Өз пікірін жою
router.delete(
  "/me/:id",
  authenticate,
  deleteMyReview
);

// =====================================
// ADMIN ROUTES
// =====================================

// Барлық пікірлер
router.get(
  "/admin",
  authenticate,
  requireAdmin,
  getAdminReviews
);

// Пікір мәртебесін өзгерту
router.patch(
  "/admin/:id/status",
  authenticate,
  requireAdmin,
  updateReviewStatus
);

// Пікірді жою
router.delete(
  "/admin/:id",
  authenticate,
  requireAdmin,
  deleteReview
);

module.exports = router;
