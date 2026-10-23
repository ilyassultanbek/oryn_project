const bcrypt = require("bcrypt");
const { randomBytes, createHash } = require("node:crypto");
const pool = require("../config/db");

// Email табылмаса да құпиясөзді тексеруге ұқсас жұмыс орындалады.
const dummyHash = bcrypt.hashSync("unused-dummy-password", 12);

async function login(req, res) {
  const { email, password } = req.body || {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    email.length > 254 ||
    !password ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({
      message: "Email мен құпиясөзді дұрыс енгізіңіз.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, email, role, password_hash
       FROM public.users
       WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user ? user.password_hash : dummyHash
    );

    if (!user || !passwordMatches) {
      return res.status(401).json({
        message: "Email немесе құпиясөз дұрыс емес.",
      });
    }

    const token = randomBytes(32).toString("hex");

    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    const sessionDuration = 12 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + sessionDuration);

    await pool.query(
      `INSERT INTO public.sessions (token_hash, user_id, expires_at)
       VALUES ($1, $2, $3)`,
      [tokenHash, user.id, expiresAt]
    );

    res.cookie("oryn_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: sessionDuration,
    });

    return res.status(200).json({
      message: "Жүйеге сәтті кірдіңіз.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Кіру қатесі:", error.code);

    return res.status(500).json({
      message: "Кіру орындалмады. Кейін қайталап көріңіз.",
    });
  }
}

module.exports = { login };