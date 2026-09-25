import { UsersDao } from '../dao/users.dao.js';

const dao = new UsersDao();

export class UsersRepository {
  async create(userData) {
    return await dao.create(userData);
  }

  async findByEmail(email) {
    return await dao.findByEmail(email);
  }
}