const pool = require("../config/db");

async function logout(req, res) {
  try {
    await pool.query(
      "DELETE FROM public.sessions WHERE token_hash = $1",
      [req.sessionHash]
    );

    res.clearCookie("oryn_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Жүйеден шықтыңыз.",
    });
  } catch (error) {
    console.error("Шығу қатесі:", error.code);

    return res.status(500).json({
      message: "Жүйеден шығу орындалмады. Қайта көріңіз.",
    });
  }
}

module.exports = { logout };