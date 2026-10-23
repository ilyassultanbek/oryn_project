
const pool = require("../config/db");

function parseParkingId(value) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) && id <= 2147483647
    ? id
    : null;
}

function getStatus(capacity, freeSpaces) {
  if (freeSpaces === null) return "unknown";
  if (freeSpaces === 0) return "full";
  return "available";
}

function formatParking(row) {
  const capacity = row.capacity;
  const freeSpaces = row.free_spaces;

  return {
    id: row.id,
    name: row.name,
    district: row.district,
    address: row.address,
    capacity,
    freeSpaces,
    occupiedSpaces:
      freeSpaces === null ? null : capacity - freeSpaces,
    occupancyPercent:
      freeSpaces === null || capacity === 0
        ? null
        : Math.round(((capacity - freeSpaces) / capacity) * 100),
    status: getStatus(capacity, freeSpaces),
    updatedAt: row.updated_at,
  };
}

// GET /api/v1/admin/occupancy
async function getOccupancy(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        district,
        address,
        capacity,
        free_spaces,
        updated_at
      FROM public.parkings
      ORDER BY name ASC, id ASC
    `);

    const parkings = result.rows.map(formatParking);

    const knownParkings = parkings.filter(
      (parking) => parking.freeSpaces !== null
    );

    const summary = {
      totalParkings: parkings.length,
      knownParkings: knownParkings.length,
      unknownParkings: parkings.length - knownParkings.length,
      totalCapacity: parkings.reduce(
        (sum, parking) => sum + parking.capacity,
        0
      ),
      knownCapacity: knownParkings.reduce(
        (sum, parking) => sum + parking.capacity,
        0
      ),
      freeSpaces: knownParkings.reduce(
        (sum, parking) => sum + parking.freeSpaces,
        0
      ),
      occupiedSpaces: knownParkings.reduce(
        (sum, parking) => sum + parking.occupiedSpaces,
        0
      ),
    };

    summary.occupancyPercent =
      summary.knownCapacity > 0
        ? Math.round(
            (summary.occupiedSpaces / summary.knownCapacity) * 100
          )
        : null;

    res.set("Cache-Control", "no-store");

    return res.json({
      summary,
      parkings,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/v1/admin/occupancy/:id
async function updateOccupancy(req, res, next) {
  const id = parseParkingId(req.params.id);
  const freeSpaces = req.body?.freeSpaces;

  if (id === null) {
    return res.status(400).json({
      message: "Тұрақ ID дұрыс емес.",
    });
  }

  if (
    freeSpaces !== null &&
    (!Number.isInteger(freeSpaces) || freeSpaces < 0)
  ) {
    return res.status(400).json({
      message:
        "Бос орын саны теріс емес бүтін сан немесе null болуы керек.",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE public.parkings
       SET
         free_spaces = $1,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
         AND (
           $1::integer IS NULL
           OR $1::integer <= capacity
         )
       RETURNING
         id,
         name,
         district,
         address,
         capacity,
         free_spaces,
         updated_at`,
      [freeSpaces, id]
    );

    if (result.rowCount === 0) {
      const exists = await pool.query(
        "SELECT capacity FROM public.parkings WHERE id = $1",
        [id]
      );

      if (!exists.rowCount) {
        return res.status(404).json({
          message: "Тұрақ табылмады.",
        });
      }

      return res.status(400).json({
        message: `Бос орын саны тұрақ сыйымдылығынан (${exists.rows[0].capacity}) аспауы керек.`,
      });
    }

    res.set("Cache-Control", "no-store");

    return res.json({
      message: "Бос орын саны жаңартылды.",
      parking: formatParking(result.rows[0]),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOccupancy,
  updateOccupancy,
};
