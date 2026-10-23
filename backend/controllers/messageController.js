
const pool = require("../config/db");

const topics = [
  "question",
  "suggestion",
  "error",
  "partnership",
];

const statuses = ["new", "in_progress", "resolved"];

const messageColumns = `
  id::text AS id,
  name,
  email,
  topic,
  message,
  status,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

function databaseError(res, error) {
  console.error("Хабарламалар API қатесі:", error.code);

  return res.status(500).json({
    message: "Сұрауды орындау мүмкін болмады. Кейін қайталаңыз.",
  });
}

function parseId(value) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) && id <= 2147483647
    ? id
    : null;
}

async function createMessage(req, res) {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({
      message: "Хабарлама деректері дұрыс емес.",
    });
  }

  const allowedFields = ["name", "email", "topic", "message"];

  if (
    Object.keys(body).some(
      (key) => !allowedFields.includes(key)
    )
  ) {
    return res.status(400).json({
      message: "Сұрауда рұқсат етілмеген өрістер бар.",
    });
  }

  if (
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.message !== "string" ||
    !topics.includes(body.topic)
  ) {
    return res.status(400).json({
      message: "Барлық өрісті дұрыс толтырыңыз.",
    });
  }

  const name = body.name.trim();
  const email = body.email.trim().toLowerCase();
  const message = body.message.trim();

  if (!name || name.length > 100) {
    return res.status(400).json({
      message: "Атыңызды енгізіңіз: ең көбі 100 таңба.",
    });
  }

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return res.status(400).json({
      message: "Email мекенжайын дұрыс енгізіңіз.",
    });
  }

  if (!message || message.length > 3000) {
    return res.status(400).json({
      message: "Хабарлама 1–3000 таңба болуы керек.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO public.contact_messages (
        name, email, topic, message
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id::text AS id,
        status,
        created_at AS "createdAt"`,
      [name, email, body.topic, message]
    );

    return res.status(201).json({
      message: "Хабарлама әкімшіге жіберілді.",
      receipt: result.rows[0],
    });
  } catch (error) {
    return databaseError(res, error);
  }
}

async function getMessages(req, res) {
  try {
    const result = await pool.query(`
      SELECT ${messageColumns}
      FROM public.contact_messages
      ORDER BY created_at DESC, id DESC
    `);

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      messages: result.rows,
    });
  } catch (error) {
    return databaseError(res, error);
  }
}

async function updateMessageStatus(req, res) {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      message: "Хабарлама идентификаторы дұрыс емес.",
    });
  }

  const body = req.body;

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).some((key) => key !== "status") ||
    !statuses.includes(body.status)
  ) {
    return res.status(400).json({
      message: "Хабарлама күйі дұрыс емес.",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE public.contact_messages
       SET
         status = $1,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING ${messageColumns}`,
      [body.status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Хабарлама табылмады.",
      });
    }

    return res.status(200).json({
      message: "Хабарлама күйі сақталды.",
      item: result.rows[0],
    });
  } catch (error) {
    return databaseError(res, error);
  }
}

async function deleteMessage(req, res) {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      message: "Хабарлама идентификаторы дұрыс емес.",
    });
  }

  try {
    const result = await pool.query(
      `DELETE FROM public.contact_messages
       WHERE id = $1
       RETURNING id::text AS id`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Хабарлама табылмады.",
      });
    }

    return res.status(200).json({
      message: "Хабарлама сәтті жойылды.",
      id: result.rows[0].id,
    });
  } catch (error) {
    return databaseError(res, error);
  }
}

module.exports = {
  createMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
};
