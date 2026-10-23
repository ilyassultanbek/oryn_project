
const API_URL = "http://localhost:3000/api/v1/reviews";

// ======================================
// COMMON API REQUEST
// ======================================

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Сұраныс орындалмады (${response.status}).`
    );
  }

  return data;
}

// ======================================
// PUBLIC REVIEWS
// ======================================

// GET /parking/:parkingId
// Тұрақтың жарияланған пікірлері
export async function getParkingReviews(parkingId) {
  return request(
    `/parking/${encodeURIComponent(parkingId)}`
  );
}

// GET /parking/:parkingId/rating
// Бір тұрақтың орташа рейтингі
export async function getParkingRating(parkingId) {
  return request(
    `/parking/${encodeURIComponent(parkingId)}/rating`
  );
}

// GET /ratings
// Барлық тұрақтардың рейтингтері
export async function getParkingRatings() {
  const data = await request("/ratings");

  return Array.isArray(data?.ratings)
    ? data.ratings
    : [];
}

// ======================================
// AUTHENTICATED USER
// ======================================

// POST /parking/:parkingId
// Жаңа пікір қалдыру
export async function createParkingReview(
  parkingId,
  { rating, comment }
) {
  return request(
    `/parking/${encodeURIComponent(parkingId)}`,
    {
      method: "POST",
      body: JSON.stringify({
        rating,
        comment,
      }),
    }
  );
}

// GET /me
// Өз пікірлерін алу
export async function getMyReviews() {
  const data = await request("/me");

  return Array.isArray(data?.reviews)
    ? data.reviews
    : [];
}

// PATCH /me/:id
// Өз пікірін өңдеу
export async function updateMyReview(
  reviewId,
  { rating, comment }
) {
  return request(
    `/me/${encodeURIComponent(reviewId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        rating,
        comment,
      }),
    }
  );
}

// DELETE /me/:id
// Өз пікірін жою
export async function deleteMyReview(reviewId) {
  return request(
    `/me/${encodeURIComponent(reviewId)}`,
    {
      method: "DELETE",
    }
  );
}

// ======================================
// ADMIN REVIEWS
// ======================================

// GET /admin
// Барлық пікірлер
export async function getAdminReviews() {
  const data = await request("/admin");

  return Array.isArray(data?.reviews)
    ? data.reviews
    : [];
}

// PATCH /admin/:id/status
// Пікірдің статусын өзгерту
export async function updateReviewStatus(
  reviewId,
  status
) {
  return request(
    `/admin/${encodeURIComponent(reviewId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

// DELETE /admin/:id
// Пікірді әкімші ретінде жою
export async function deleteReview(reviewId) {
  return request(
    `/admin/${encodeURIComponent(reviewId)}`,
    {
      method: "DELETE",
    }
  );
}
