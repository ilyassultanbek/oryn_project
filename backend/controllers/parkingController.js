const pool = require("../config/db");
const { validateParking } = require("../utils/parkingValidation");

const parkingColumns = `
  id,
  name,
  address,
  district,
  capacity,
  free_spaces AS "freeSpaces",
  price::double precision AS price,
  is_covered AS "isCovered",
  lat,
  lng,
  features
`;

function parseId(value) {
  if (!/^[1-9]\d*$/.test(value)) return null;

  const id = Number(value);

  return Number.isInteger(id) && id <= 2147483647
    ? id
    : null;
}

function parkingValues(body) {
  return [
    body.name.trim(),
    body.address.trim(),
    body.district,
    body.capacity,
    body.freeSpaces,
    body.price,
    body.isCovered,
    body.lat,
    body.lng,
    (body.features ?? []).map((feature) => feature.trim()),
  ];
}

function sendDatabaseError(res, error) {
  console.error("Тұрақ API қатесі:", error.code);

  return res.status(500).json({
    message: "Деректер қорымен жұмыс кезінде қате шықты.",
  });
}

async function getParkings(req, res) {
  try {
    const result = await pool.query(`
      SELECT ${parkingColumns}
      FROM public.parkings
      ORDER BY id
    `);

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      parkings: result.rows,
    });
  } catch (error) {
    return sendDatabaseError(res, error);
  }
}

async function createParking(req, res) {
  const validationError = validateParking(req.body);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO public.parkings (
        name, address, district, capacity, free_spaces,
        price, is_covered, lat, lng, features
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING ${parkingColumns}`,
      parkingValues(req.body)
    );

    return res.status(201).json({
      message: "Тұрақ қосылды.",
      parking: result.rows[0],
    });
  } catch (error) {
    return sendDatabaseError(res, error);
  }
}

async function updateParking(req, res) {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      message: "Тұрақ идентификаторы дұрыс емес.",
    });
  }

  const validationError = validateParking(req.body);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  try {
    const result = await pool.query(
      `UPDATE public.parkings
       SET
         name = $1,
         address = $2,
         district = $3,
         capacity = $4,
         free_spaces = $5,
         price = $6,
         is_covered = $7,
         lat = $8,
         lng = $9,
         features = $10,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING ${parkingColumns}`,
      [...parkingValues(req.body), id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Тұрақ табылмады. Ол жойылған болуы мүмкін.",
      });
    }

    return res.status(200).json({
      message: "Өзгерістер сақталды.",
      parking: result.rows[0],
    });
  } catch (error) {
    return sendDatabaseError(res, error);
  }
}

async function deleteParking(req, res) {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      message: "Тұрақ идентификаторы дұрыс емес.",
    });
  }

  try {
    const result = await pool.query(
      "DELETE FROM public.parkings WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Тұрақ табылмады.",
      });
    }

    return res.status(200).json({
      message: "Тұрақ жойылды.",
      id: result.rows[0].id,
    });
  } catch (error) {
    return sendDatabaseError(res, error);
  }
}

module.exports = {
  getParkings,
  createParking,
  updateParking,
  deleteParking,
};