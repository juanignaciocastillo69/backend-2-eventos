import { UsersRepository } from '../repositories/users.repository.js';
import { hashPassword, comparePassword } from '../utils/hash.js';

const usersRepository = new UsersRepository();

export class SessionsService {
  async registerUser({ first_name, last_name, email, password }) {
    if (!first_name || !last_name || !email || !password) {
      const error = new Error('Faltan campos obligatorios');
      error.statusCode = 400;
      throw error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('Formato de email inválido');
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 6) {
      const error = new Error('La contraseña debe tener al menos 6 caracteres');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await usersRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      const error = new Error('El email ya está registrado');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await usersRepository.create({
      first_name,
      last_name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return {
      id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      role: newUser.role,
    };
  }

  async loginUser({ email, password }) {
    const genericError = new Error('Credenciales inválidas');
    genericError.statusCode = 401;

    if (!email || !password) {
      throw genericError;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await usersRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw genericError;
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw genericError;
    }

    return {
      id: user._id,
      email: user.email,
      role: user.role,
    };
  }
}