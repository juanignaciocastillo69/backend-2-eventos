import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UsersRepository } from '../repositories/users.repository.js';
import { hashPassword, comparePassword } from '../utils/hash.js';

const usersRepository = new UsersRepository();

passport.use('register', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      const { first_name, last_name } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return done(null, false, { message: 'Faltan campos obligatorios', statusCode: 400 });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return done(null, false, { message: 'Formato de email inválido', statusCode: 400 });
      }

      if (password.length < 6) {
        return done(null, false, { message: 'La contraseña debe tener al menos 6 caracteres', statusCode: 400 });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await usersRepository.findByEmail(normalizedEmail);

      if (existingUser) {
        return done(null, false, { message: 'El email ya está registrado', statusCode: 409 });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await usersRepository.create({
        first_name,
        last_name,
        email: normalizedEmail,
        password: hashedPassword,
      });

      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use('login', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const genericInfo = { message: 'Credenciales inválidas', statusCode: 401 };

      if (!email || !password) {
        return done(null, false, genericInfo);
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = await usersRepository.findByEmail(normalizedEmail);

      if (!user) {
        return done(null, false, genericInfo);
      }

      const isValidPassword = await comparePassword(password, user.password);

      if (!isValidPassword) {
        return done(null, false, genericInfo);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

const cookieExtractor = (req) => {
  return req.cookies ? req.cookies.currentUser : null;
};

passport.use('current', new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    try {
      return done(null, payload);
    } catch (error) {
      return done(error);
    }
  }
));

export const handlePassportAuth = (strategyName) => {
  return (req, res, next) => {
    passport.authenticate(strategyName, { session: false }, (error, user, info) => {
      if (error) {
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
      }

      if (!user) {
        const statusCode = info?.statusCode || 401;
        const message = info?.message || 'No autorizado';
        return res.status(statusCode).json({ status: 'error', message });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

export default passport;