
const pool = require("../config/db");

// ======================================
// SHARED SQL COLUMNS
// ======================================

const reviewColumns = `
  r.id::text AS id,
  r.parking_id AS "parkingId",
  r.user_id AS "userId",
  r.rating,
  r.comment,
  r.status,
  r.created_at AS "createdAt",
  r.updated_at AS "updatedAt",
  u.name AS "userName",
  p.name AS "parkingName"
`;

// ======================================
// HELPERS
// ======================================

function parseId(value) {
  if (!/^[1-9]\d*$/.test(String(value))) {
    return null;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) && id <= 2147483647
    ? id
    : null;
}

function handleError(res, error) {
  console.error("Reviews API:", error);

  if (error.code === "23505") {
    return res.status(409).json({
      message: "Сіз бұл тұраққа пікір қалдырғансыз.",
    });
  }

  if (error.code === "23503") {
    return res.status(400).json({
      message: "Қолданушы немесе тұрақ табылмады.",
    });
  }

  if (error.code === "23514") {
    return res.status(400).json({
      message: "Пікір деректері талаптарға сәйкес емес.",
    });
  }

  return res.status(500).json({
    message: "Сервер қатесі. Кейін қайталаңыз.",
  });
}

function validateReview(rating, comment) {
  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return "Баға 1 мен 5 аралығында болуы керек.";
  }

  if (
    typeof comment !== "string" ||
    comment.trim().length < 1 ||
    comment.trim().length > 2000
  ) {
    return "Пікір мәтіні 1–2000 таңба болуы керек.";
  }

  return null;
}

// ======================================
// PUBLIC REVIEWS
// ======================================

// GET /parking/:parkingId
async function getParkingReviews(req, res) {
  const parkingId = parseId(req.params.parkingId);

  if (!parkingId) {
    return res.status(400).json({
      message: "Тұрақ ID дұрыс емес.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT ${reviewColumns}
       FROM public.parking_reviews r
       JOIN public.users u
         ON u.id = r.user_id
       JOIN public.parkings p
         ON p.id = r.parking_id
       WHERE r.parking_id = $1
         AND r.status = 'approved'
       ORDER BY r.created_at DESC, r.id DESC`,
      [parkingId]
    );

    return res.json({
      reviews: result.rows,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /parking/:parkingId/rating
async function getParkingRating(req, res) {
  const parkingId = parseId(req.params.parkingId);

  if (!parkingId) {
    return res.status(400).json({
      message: "Тұрақ ID дұрыс емес.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT
         COUNT(*)::integer AS "reviewCount",
         ROUND(AVG(rating)::numeric, 1)
           AS "averageRating"
       FROM public.parking_reviews
       WHERE parking_id = $1
         AND status = 'approved'`,
      [parkingId]
    );

    const row = result.rows[0];

    return res.json({
      reviewCount: row.reviewCount,
      averageRating: Number(
        row.averageRating ?? 0
      ),
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /ratings
async function getParkingRatings(req, res) {
  try {
    const result = await pool.query(
      `SELECT
         parking_id AS "parkingId",
         COUNT(*)::integer AS "reviewCount",
         ROUND(AVG(rating)::numeric, 1)
           AS "averageRating"
       FROM public.parking_reviews
       WHERE status = 'approved'
       GROUP BY parking_id`
    );

    return res.json({
      ratings: result.rows.map((row) => ({
        parkingId: row.parkingId,
        reviewCount: row.reviewCount,
        averageRating: Number(
          row.averageRating ?? 0
        ),
      })),
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// ======================================
// AUTHENTICATED USER
// ======================================

// POST /parking/:parkingId
async function createReview(req, res) {
  const parkingId = parseId(req.params.parkingId);
  const userId = parseId(req.user?.id);

  if (!userId) {
    return res.status(401).json({
      message: "Авторизация қажет.",
    });
  }

  if (!parkingId) {
    return res.status(400).json({
      message: "Тұрақ ID дұрыс емес.",
    });
  }

  const { rating, comment } = req.body || {};

  const validationError = validateReview(
    rating,
    comment
  );

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO public.parking_reviews
         (parking_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING
         id::text AS id,
         rating,
         comment,
         status,
         created_at AS "createdAt"`,
      [
        parkingId,
        userId,
        rating,
        comment.trim(),
      ]
    );

    return res.status(201).json({
      message: "Пікір тексеруге жіберілді.",
      review: result.rows[0],
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /me
async function getMyReviews(req, res) {
  const userId = parseId(req.user?.id);

  if (!userId) {
    return res.status(401).json({
      message: "Авторизация қажет.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT ${reviewColumns}
       FROM public.parking_reviews r
       JOIN public.users u
         ON u.id = r.user_id
       JOIN public.parkings p
         ON p.id = r.parking_id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC, r.id DESC`,
      [userId]
    );

    return res.json({
      reviews: result.rows,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// PATCH /me/:id
async function updateMyReview(req, res) {
  const userId = parseId(req.user?.id);
  const reviewId = parseId(req.params.id);

  if (!userId) {
    return res.status(401).json({
      message: "Авторизация қажет.",
    });
  }

  if (!reviewId) {
    return res.status(400).json({
      message: "Пікір ID дұрыс емес.",
    });
  }

  const { rating, comment } = req.body || {};

  const validationError = validateReview(
    rating,
    comment
  );

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  try {
    const result = await pool.query(
      `UPDATE public.parking_reviews
       SET rating = $1,
           comment = $2,
           status = 'pending',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
         AND user_id = $4
       RETURNING
         id::text AS id,
         rating,
         comment,
         status,
         updated_at AS "updatedAt"`,
      [
        rating,
        comment.trim(),
        reviewId,
        userId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Пікір табылмады.",
      });
    }

    return res.json({
      message:
        "Пікір жаңартылды және қайта тексеруге жіберілді.",
      review: result.rows[0],
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// DELETE /me/:id
async function deleteMyReview(req, res) {
  const userId = parseId(req.user?.id);
  const reviewId = parseId(req.params.id);

  if (!userId) {
    return res.status(401).json({
      message: "Авторизация қажет.",
    });
  }

  if (!reviewId) {
    return res.status(400).json({
      message: "Пікір ID дұрыс емес.",
    });
  }

  try {
    const result = await pool.query(
      `DELETE FROM public.parking_reviews
       WHERE id = $1
         AND user_id = $2
       RETURNING id`,
      [reviewId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Пікір табылмады.",
      });
    }

    return res.json({
      message: "Пікір сәтті жойылды.",
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// ======================================
// ADMIN REVIEWS
// ======================================

// GET /admin
async function getAdminReviews(req, res) {
  try {
    const result = await pool.query(
      `SELECT ${reviewColumns}
       FROM public.parking_reviews r
       JOIN public.users u
         ON u.id = r.user_id
       JOIN public.parkings p
         ON p.id = r.parking_id
       ORDER BY r.created_at DESC, r.id DESC`
    );

    return res.json({
      reviews: result.rows,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// PATCH /admin/:id/status
async function updateReviewStatus(req, res) {
  const id = parseId(req.params.id);
  const { status } = req.body || {};

  if (!id) {
    return res.status(400).json({
      message: "Пікір ID дұрыс емес.",
    });
  }

  if (
    !["pending", "approved", "hidden"].includes(
      status
    )
  ) {
    return res.status(400).json({
      message: "Пікір статусы дұрыс емес.",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE public.parking_reviews
       SET status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id`,
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Пікір табылмады.",
      });
    }

    return res.json({
      message: "Пікір статусы жаңартылды.",
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// DELETE /admin/:id
async function deleteReview(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Пікір ID дұрыс емес.",
    });
  }

  try {
    const result = await pool.query(
      `DELETE FROM public.parking_reviews
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Пікір табылмады.",
      });
    }

    return res.json({
      message: "Пікір жойылды.",
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// ======================================
// EXPORTS
// ======================================

module.exports = {
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
};
