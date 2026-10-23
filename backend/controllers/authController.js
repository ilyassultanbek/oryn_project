const bcrypt = require("bcrypt");
const pool = require("../config/db");

async function register(req, res) {
  const { name, email, password } = req.body || {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      message: "Аты-жөні, email және құпиясөз міндетті.",
    });
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedName.length < 2 || normalizedName.length > 100) {
    return res.status(400).json({
      message: "Аты-жөні 2–100 таңба болуы керек.",
    });
  }

  if (
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    return res.status(400).json({
      message: "Email форматы дұрыс емес.",
    });
  }

  if (
    password.length < 8 ||
    !password.trim() ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({
      message: "Құпиясөз кемінде 8 таңба, ең көбі 72 UTF-8 байт болуы керек.",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO public.users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role, created_at`,
      [normalizedName, normalizedEmail, passwordHash]
    );

    return res.status(201).json({
      message: "Тіркелу сәтті аяқталды.",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Бұл email бұрын тіркелген.",
      });
    }

    console.error("Тіркелу қатесі:", error.code);

    return res.status(500).json({
      message: "Тіркелу орындалмады. Кейін қайталап көріңіз.",
    });
  }
}

module.exports = { register };