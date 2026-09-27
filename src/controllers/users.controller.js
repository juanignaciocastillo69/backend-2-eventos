import { UsersService } from '../services/users.service.js';

const usersService = new UsersService();

export const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json({ status: 'success', payload: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener usuarios' });
  }
};