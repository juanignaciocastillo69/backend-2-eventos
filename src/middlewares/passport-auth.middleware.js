import passport from 'passport';

export const handlePassportAuth = (strategyName) => (req, res, next) => {
  passport.authenticate(strategyName, { session: false }, (error, user, info) => {
    if (error) return next(error);

    if (!user) {
      const hasOwnInfo = Boolean(info?.statusCode);
      const failure = new Error(hasOwnInfo ? info.message : 'No autenticado');
      failure.statusCode = hasOwnInfo ? info.statusCode : 401;
      return next(failure);
    }

    req.user = user;
    next();
  })(req, res, next);
};
