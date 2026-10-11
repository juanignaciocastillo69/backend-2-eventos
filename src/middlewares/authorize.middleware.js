export const authorize = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    const error = new Error('No autenticado');
    error.statusCode = 401;
    return next(error);
  }

  if (!allowedRoles.includes(req.user.role)) {
    const error = new Error('No tenés permisos para realizar esta acción');
    error.statusCode = 403;
    return next(error);
  }

  next();
};
