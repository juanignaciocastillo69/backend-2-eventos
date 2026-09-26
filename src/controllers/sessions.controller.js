import { SessionsService } from '../services/sessions.service.js';
import { generateToken } from '../utils/jwt.js';

const sessionsService = new SessionsService();

export const getSessions = (req, res) => {
  res.json({ status: 'success', message: 'Sessions endpoint - por implementar' });
};

export const register = async (req, res) => {
  try {
    const newUser = await sessionsService.registerUser(req.body);
    res.status(201).json({ status: 'success', payload: newUser });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await sessionsService.loginUser(req.body);
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.cookie('currentUser', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({ status: 'success', message: 'Login correcto' });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const current = (req, res) => {
  res.status(200).json({ status: 'success', payload: req.user });
};

export const logout = (req, res) => {
  res.clearCookie('currentUser');
  res.status(200).json({ status: 'success', message: 'Sesión cerrada' });
};