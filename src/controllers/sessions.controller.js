import { SessionsService } from '../services/sessions.service.js';

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