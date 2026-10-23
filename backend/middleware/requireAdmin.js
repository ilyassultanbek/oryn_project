function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: "Алдымен жүйеге кіріңіз.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Бұл әрекетке әкімші құқығы қажет.",
    });
  }

  next();
}

module.exports = requireAdmin;