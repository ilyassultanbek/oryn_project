
const pool = require("../config/db");

const ALLOWED_ROLES = new Set([
  "user",
  "admin",
  "owner",
  "operator",
]);

function parseUserId(value) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

// GET /api/v1/admin/users
async function getUsers(req, res, next) {
  try {
    const page = Math.max(
      1,
      Number.parseInt(req.query.page, 10) || 1
    );

    const limit = 10;
    const offset = (page - 1) * limit;

    if (!Number.isSafeInteger(offset)) {
      return res.status(400).json({
        message: "Бет нөмірі дұрыс емес.",
      });
    }

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim().slice(0, 100)
        : "";

    const searchPattern = `%${search
      .replace(/[\\%_]/g, "\\$&")}%`;

    const where = search
      ? `WHERE name ILIKE $1 ESCAPE '\\'
         OR email ILIKE $1 ESCAPE '\\'`
      : "";

    const params = search ? [searchPattern] : [];

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM public.users
       ${where}`,
      params
    );

    const result = await pool.query(
      `SELECT id, name, email, role, created_at
       FROM public.users
       ${where}
       ORDER BY created_at DESC, id DESC
       LIMIT $${params.length + 1}
       OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    const total = countResult.rows[0].total;

    return res.json({
      users: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/admin/users/stats
async function getUserStats(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (
           WHERE role = 'admin'
         )::int AS admins,
         COUNT(*) FILTER (
           WHERE role = 'user'
         )::int AS regular_users
       FROM public.users`
    );

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

// PATCH /api/v1/admin/users/:id/role
async function updateUserRole(req, res, next) {
  const id = parseUserId(req.params.id);
  const role = req.body?.role;

  if (!id) {
    return res.status(400).json({
      message: "Қолданушы ID дұрыс емес.",
    });
  }

  if (typeof role !== "string" || !ALLOWED_ROLES.has(role)) {
    return res.status(400).json({
      message: "Рөл user немесе admin болуы керек.",
    });
  }

  if (String(req.user.id) === String(id)) {
    return res.status(403).json({
      message: "Өзіңіздің рөліңізді өзгертуге болмайды.",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE public.users
       SET role = $1
       WHERE id = $2
       RETURNING id, name, email, role, created_at`,
      [role, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Қолданушы табылмады.",
      });
    }

    return res.json({
      message: "Қолданушы рөлі жаңартылды.",
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getUserStats,
  updateUserRole,
};
