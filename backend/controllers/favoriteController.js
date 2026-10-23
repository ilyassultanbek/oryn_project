const pool = require("../config/db");

function parseParkingId(value) {
  if (!/^[1-9]\d*$/.test(value)) return null;

  const id = Number(value);

  return Number.isInteger(id) && id <= 2147483647
    ? id
    : null;
}

function databaseError(res, error) {
  console.error("Таңдаулылар қатесі:", error.code ?? "UNKNOWN");

  return res.status(500).json({
    message: "Таңдаулылармен жұмыс істеу мүмкін болмады.",
  });
}

async function getFavorites(req, res) {
  try {
    const result = await pool.query(
      `SELECT parking_id
       FROM public.favorites
       WHERE user_id = $1
       ORDER BY created_at DESC, parking_id DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      favorites: result.rows.map((row) => row.parking_id),
    });
  } catch (error) {
    return databaseError(res, error);
  }
}

async function addFavorite(req, res) {
  const parkingId = parseParkingId(req.params.parkingId);

  if (parkingId === null) {
    return res.status(400).json({
      message: "Тұрақ идентификаторы дұрыс емес.",
    });
  }

  try {
    const parking = await pool.query(
      "SELECT id FROM public.parkings WHERE id = $1",
      [parkingId]
    );

    if (parking.rowCount === 0) {
      return res.status(404).json({
        message: "Тұрақ табылмады.",
      });
    }

    await pool.query(
      `INSERT INTO public.favorites (user_id, parking_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, parking_id) DO NOTHING`,
      [req.user.id, parkingId]
    );

    return res.status(200).json({
      message: "Тұрақ таңдаулыларға қосылды.",
      parkingId,
      isFavorite: true,
    });
  } catch (error) {
    // Тұрақ немесе аккаунт сұраныс кезінде жойылып кетуі мүмкін.
    if (error.code === "23503") {
      return res.status(409).json({
        message:
          "Тұрақ немесе аккаунт енді қолжетімсіз. Бетті жаңартыңыз.",
      });
    }

    return databaseError(res, error);
  }
}

async function removeFavorite(req, res) {
  const parkingId = parseParkingId(req.params.parkingId);

  if (parkingId === null) {
    return res.status(400).json({
      message: "Тұрақ идентификаторы дұрыс емес.",
    });
  }

  try {
    await pool.query(
      `DELETE FROM public.favorites
       WHERE user_id = $1 AND parking_id = $2`,
      [req.user.id, parkingId]
    );

    return res.status(200).json({
      message: "Тұрақ таңдаулылардан алынды.",
      parkingId,
      isFavorite: false,
    });
  } catch (error) {
    return databaseError(res, error);
  }
}

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};