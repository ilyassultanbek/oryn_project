
const bcrypt = require("bcrypt");
const pool = require("../config/db");

function validateEmail(email) {
  return (
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

// PATCH /api/v1/profile
async function updateProfile(req, res, next) {
  const { name, email } = req.body || {};

  if (
    typeof name !== "string" ||
    typeof email !== "string"
  ) {
    return res.status(400).json({
      message: "Аты-жөні және email міндетті.",
    });
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedName.length < 2 ||
    normalizedName.length > 100
  ) {
    return res.status(400).json({
      message: "Аты-жөні 2–100 таңба болуы керек.",
    });
  }

  if (!validateEmail(normalizedEmail)) {
    return res.status(400).json({
      message: "Email форматы дұрыс емес.",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE public.users
       SET name = $1,
           email = $2
       WHERE id = $3
       RETURNING id, name, email, role, created_at`,
      [normalizedName, normalizedEmail, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Пайдаланушы табылмады.",
      });
    }

    res.set("Cache-Control", "no-store");

    return res.json({
      message: "Жеке мәліметтер сәтті жаңартылды.",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Бұл email басқа аккаунтта тіркелген.",
      });
    }

    next(error);
  }
}

// PATCH /api/v1/profile/password
async function changePassword(req, res, next) {
  const {
    currentPassword,
    newPassword,
    confirmPassword,
  } = req.body || {};

  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return res.status(400).json({
      message: "Барлық құпиясөз өрістерін толтырыңыз.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "Жаңа құпиясөздер сәйкес келмейді.",
    });
  }

  if (
    newPassword.length < 8 ||
    !newPassword.trim() ||
    Buffer.byteLength(newPassword, "utf8") > 72
  ) {
    return res.status(400).json({
      message:
        "Жаңа құпиясөз кемінде 8 таңба, ең көбі 72 UTF-8 байт болуы керек.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, password_hash
       FROM public.users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Пайдаланушы табылмады.",
      });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Ағымдағы құпиясөз дұрыс емес.",
      });
    }

    if (
      await bcrypt.compare(
        newPassword,
        user.password_hash
      )
    ) {
      return res.status(400).json({
        message:
          "Жаңа құпиясөз бұрынғысынан өзгеше болуы керек.",
      });
    }

    const passwordHash = await bcrypt.hash(
      newPassword,
      12
    );

    // Compare-and-swap: параллель өзгерістерден қорғайды.
    const updateResult = await pool.query(
      `UPDATE public.users
       SET password_hash = $1
       WHERE id = $2 AND password_hash = $3`,
      [passwordHash, req.user.id, user.password_hash]
    );

    if (updateResult.rowCount === 0) {
      return res.status(409).json({
        message:
          "Құпиясөз басқа сұрауда өзгертілген. Қайта кіріп, қайталаңыз.",
      });
    }

    res.set("Cache-Control", "no-store");

    return res.json({
      message: "Құпиясөз сәтті өзгертілді.",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateProfile,
  changePassword,
};
