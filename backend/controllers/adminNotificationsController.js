
const pool = require("../config/db");

const AUDIENCES = [
  "all",
  "user",
  "owner",
  "operator",
  "admin",
];

function getId(req) {
  const id = Number(req.params.id);
  return Number.isSafeInteger(id) && id > 0
    ? id
    : null;
}

function validateNotification(data) {
  const title = data.title?.trim();
  const body = data.body?.trim();
  const audience = data.audience ?? "all";

  if (
    typeof title !== "string" ||
    title.length === 0 ||
    title.length > 120
  ) {
    return {
      error: "Тақырып 1–120 таңба болуы керек.",
    };
  }

  if (
    typeof body !== "string" ||
    body.length === 0 ||
    body.length > 2000
  ) {
    return {
      error: "Мәтін 1–2000 таңба болуы керек.",
    };
  }

  if (!AUDIENCES.includes(audience)) {
    return {
      error: "Аудитория дұрыс таңдалмаған.",
    };
  }

  return {
    value: { title, body, audience },
  };
}

// 1. Барлық хабарландыруларды алу (Admin)
async function getNotifications(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT *
      FROM public.oryn_notifications
      ORDER BY created_at DESC, id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

// 2. Жаңа хабарландыру құру
async function createNotification(req, res, next) {
  try {
    const validation = validateNotification(req.body);

    if (validation.error) {
      return res.status(400).json({
        error: validation.error,
      });
    }

    const { title, body, audience } = validation.value;

    const result = await pool.query(
      `
      INSERT INTO public.oryn_notifications
        (title, body, audience, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [title, body, audience, req.user?.id ?? null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

// 3. Хабарландыруды өзгерту
async function updateNotification(req, res, next) {
  try {
    const id = getId(req);

    if (!id) {
      return res.status(400).json({
        error: "ID дұрыс емес.",
      });
    }

    const validation = validateNotification(req.body);

    if (validation.error) {
      return res.status(400).json({
        error: validation.error,
      });
    }

    const { title, body, audience } = validation.value;

    const result = await pool.query(
      `
      UPDATE public.oryn_notifications
      SET title = $1,
          body = $2,
          audience = $3,
          updated_at = NOW()
      WHERE id = $4
      RETURNING *
      `,
      [title, body, audience, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Хабарландыру табылмады.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

// 4. Жариялау немесе жарияланымнан алу
async function setNotificationPublished(req, res, next) {
  try {
    const id = getId(req);

    if (!id) {
      return res.status(400).json({
        error: "ID дұрыс емес.",
      });
    }

    const { published } = req.body;

    if (typeof published !== "boolean") {
      return res.status(400).json({
        error: "published мәні boolean болуы керек.",
      });
    }

    const result = await pool.query(
      `
      UPDATE public.oryn_notifications
      SET published_at =
            CASE
              WHEN $1::boolean THEN
                COALESCE(published_at, NOW())
              ELSE NULL
            END,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [published, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Хабарландыру табылмады.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

// 5. Хабарландыруды жою
async function deleteNotification(req, res, next) {
  try {
    const id = getId(req);

    if (!id) {
      return res.status(400).json({
        error: "ID дұрыс емес.",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM public.oryn_notifications
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Хабарландыру табылмады.",
      });
    }

    res.json({
      success: true,
      id: result.rows[0].id,
    });
  } catch (error) {
    next(error);
  }
}

// 6. Барлық пайдаланушыларға ашық хабарландырулар
async function getPublicNotifications(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT id, title, body, published_at
      FROM public.oryn_notifications
      WHERE published_at IS NOT NULL
        AND audience = 'all'
        AND published_at <= NOW()
      ORDER BY published_at DESC
      LIMIT 50
    `);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications,
  createNotification,
  updateNotification,
  setNotificationPublished,
  deleteNotification,
  getPublicNotifications,
};
