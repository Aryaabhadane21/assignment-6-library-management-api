/**
 * Role Authorization Middleware Factory
 * Restricts endpoint access based on user role(s).
 * @param {...string} allowedRoles - Roles permitted to access the route (e.g. 'librarian', 'student')
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. User role information missing.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requiring role: [${allowedRoles.join(', ')}]. Current user role: '${req.user.role}'`
      });
    }

    next();
  };
};

module.exports = {
  requireRole
};
