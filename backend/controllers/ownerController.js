
const pool = require("../config/db");

function parseId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// GET /api/v1/admin/owners
async function getOwners(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.created_at,
        COUNT(p.id)::int AS parking_count
      FROM public.users u
      LEFT JOIN public.parkings p
        ON p.owner_id = u.id
      WHERE u.role = 'owner'
      GROUP BY u.id
      ORDER BY u.created_at DESC, u.id DESC
    `);

    return res.json({ owners: result.rows });
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/admin/owners/parkings
async function getOwnerParkings(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.address,
        p.district,
        p.capacity,
        p.free_spaces,
        p.owner_id,
        u.name AS owner_name,
        u.email AS owner_email
      FROM public.parkings p
      LEFT JOIN public.users u
        ON u.id = p.owner_id
      ORDER BY p.name ASC, p.id ASC
    `);

    return res.json({ parkings: result.rows });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/v1/admin/owners/:id/promote
async function promoteOwner(req, res, next) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Қолданушы ID дұрыс емес.",
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
       SET role = 'owner'
       WHERE id = $1 AND role = 'user'
       RETURNING id, name, email, role, created_at`,
      [id]
    );

    if (!result.rowCount) {
      return res.status(409).json({
        message:
          "Қолданушы табылмады немесе оның рөлі user емес.",
      });
    }

    return res.json({
      message: "Қолданушы тұрақ иесі ретінде тіркелді.",
      owner: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/v1/admin/owners/parkings/:parkingId
async function assignParkingOwner(req, res, next) {
  const parkingId = parseId(req.params.parkingId);

  const ownerId =
    req.body?.ownerId === null
      ? null
      : parseId(req.body?.ownerId);

  if (!parkingId) {
    return res.status(400).json({
      message: "Тұрақ ID дұрыс емес.",
    });
  }

  if (ownerId === null && req.body?.ownerId !== null) {
    return res.status(400).json({
      message: "Иесінің ID дұрыс емес.",
    });
  }

  try {
    // Бір транзакцияда иесінің рөлін тексеріп,
    // тұраққа бекітеміз.
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      if (ownerId !== null) {
        const ownerResult = await client.query(
          `SELECT id
           FROM public.users
           WHERE id = $1 AND role = 'owner'
           FOR UPDATE`,
          [ownerId]
        );

        if (!ownerResult.rowCount) {
          await client.query("ROLLBACK");

          return res.status(404).json({
            message: "Тұрақ иесі табылмады.",
          });
        }
      }

      const result = await client.query(
        `UPDATE public.parkings
         SET owner_id = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, name, owner_id`,
        [ownerId, parkingId]
      );

      if (!result.rowCount) {
        await client.query("ROLLBACK");

        return res.status(404).json({
          message: "Тұрақ табылмады.",
        });
      }

      await client.query("COMMIT");

      return res.json({
        message:
          ownerId === null
            ? "Тұрақ иесінен ажыратылды."
            : "Тұрақ иесіне бекітілді.",
        parking: result.rows[0],
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOwners,
  getOwnerParkings,
  promoteOwner,
  assignParkingOwner,
};
