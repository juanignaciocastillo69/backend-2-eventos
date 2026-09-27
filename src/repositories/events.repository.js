import { EventsDao } from '../dao/events.dao.js';

const dao = new EventsDao();

export class EventsRepository {
  async create(eventData) {
    return await dao.create(eventData);
  }

  async findById(id) {
    return await dao.findById(id);
  }

  async update(id, updateData) {
    return await dao.update(id, updateData);
  }
}