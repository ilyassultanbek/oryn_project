
const pool = require("../config/db");

// Админ панельге арналған нақты статистика
async function getAnalytics(req, res, next) {
  try {
    // 1. Жалпы статистика
    const generalQuery = pool.query(`
      SELECT
        (SELECT COUNT(*)::int
         FROM public.parkings) AS parkings,

        (SELECT COUNT(*)::int
         FROM public.users) AS users,

        (SELECT COUNT(*)::int
         FROM public.contact_messages) AS messages,

        (SELECT COUNT(*)::int
         FROM public.parking_reviews) AS reviews,

        (SELECT COUNT(*)::int
         FROM public.parkings
         WHERE free_spaces IS NULL) AS unknown_parkings,

        (SELECT COALESCE(SUM(capacity), 0)::int
         FROM public.parkings
         WHERE free_spaces IS NOT NULL) AS known_capacity,

        (SELECT COALESCE(SUM(free_spaces), 0)::int
         FROM public.parkings
         WHERE free_spaces IS NOT NULL) AS free_spaces
    `);

    // 2. Аудандар бойынша статистика
    const districtsQuery = pool.query(`
      SELECT
        district,
        COUNT(*)::int AS parkings,

        COALESCE(
          SUM(capacity)
          FILTER (WHERE free_spaces IS NOT NULL),
          0
        )::int AS capacity,

        COALESCE(
          SUM(free_spaces),
          0
        )::int AS free_spaces

      FROM public.parkings
      GROUP BY district
      ORDER BY district
    `);

    // 3. Соңғы 14 күндегі белсенділік
    const activityQuery = pool.query(`
      WITH days AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '13 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        )::date AS day
      ),
      activity AS (
        SELECT created_at::date AS day,
               'users' AS kind
        FROM public.users
        WHERE created_at >=
          CURRENT_DATE - INTERVAL '13 days'

        UNION ALL

        SELECT created_at::date,
               'messages'
        FROM public.contact_messages
        WHERE created_at >=
          CURRENT_DATE - INTERVAL '13 days'

        UNION ALL

        SELECT created_at::date,
               'reviews'
        FROM public.parking_reviews
        WHERE created_at >=
          CURRENT_DATE - INTERVAL '13 days'
      )

      SELECT
        TO_CHAR(d.day, 'YYYY-MM-DD') AS day,

        COUNT(*) FILTER (
          WHERE kind = 'users'
        )::int AS users,

        COUNT(*) FILTER (
          WHERE kind = 'messages'
        )::int AS messages,

        COUNT(*) FILTER (
          WHERE kind = 'reviews'
        )::int AS reviews

      FROM days d
      LEFT JOIN activity a ON a.day = d.day
      GROUP BY d.day
      ORDER BY d.day
    `);

    // Сұраныстарды қатар орындау
    const [general, districts, activity] =
      await Promise.all([
        generalQuery,
        districtsQuery,
        activityQuery,
      ]);

    const metrics = general.rows[0];

    // Толған орындарды есептеу
    metrics.occupied_spaces =
      metrics.known_capacity - metrics.free_spaces;

    // Толу пайызы
    metrics.occupancy_percent =
      metrics.known_capacity > 0
        ? Math.round(
            (metrics.occupied_spaces /
              metrics.known_capacity) * 100
          )
        : null;

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      metrics,
      districts: districts.rows,
      activity: activity.rows,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAnalytics,
};
