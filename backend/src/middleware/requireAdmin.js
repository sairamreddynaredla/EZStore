const ADMIN_ROLES = new Set(["admin", "super_admin"]);

export const requireAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (!role || !ADMIN_ROLES.has(role)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  return next();
};

export default requireAdmin;
