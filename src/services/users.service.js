import { UsersRepository } from '../repositories/users.repository.js';

const usersRepository = new UsersRepository();

export class UsersService {
  async getAllUsers() {
    return await usersRepository.findAll();
  }
}