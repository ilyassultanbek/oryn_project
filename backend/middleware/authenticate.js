const { createHash } = require("node:crypto");
const pool = require("../config/db");

async function authenticate(req, res, next) {
  const cookies = (req.headers.cookie || "")
    .split(";")
    .map((cookie) => cookie.trim());

  const sessionCookie = cookies.find((cookie) =>
    cookie.startsWith("oryn_session=")
  );

  const token = sessionCookie?.slice("oryn_session=".length);

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return res.status(401).json({
      message: "Алдымен жүйеге кіріңіз.",
    });
  }

  try {
    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role
       FROM public.sessions AS s
       JOIN public.users AS u ON u.id = s.user_id
       WHERE s.token_hash = $1
         AND s.expires_at > CURRENT_TIMESTAMP`,
      [tokenHash]
    );

    if (!result.rows[0]) {
      return res.status(401).json({
        message: "Сессия аяқталды. Қайта кіріңіз.",
      });
    }

    req.user = result.rows[0];
    req.sessionHash = tokenHash;

    next();
  } catch (error) {
    console.error("Сессияны тексеру қатесі:", error.code);

    return res.status(500).json({
      message: "Сессияны тексеру мүмкін болмады.",
    });
  }
}

module.exports = authenticate;