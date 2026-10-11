import { UsersService } from '../services/users.service.js';
import { toUserDTO } from '../dto/user.dto.js';

const usersService = new UsersService();

export const getAllUsers = async (req, res) => {
  const users = await usersService.getAllUsers();
  res.status(200).json({ status: 'success', payload: users.map(toUserDTO) });
};
