import { TicketsDao } from '../dao/tickets.dao.js';

const dao = new TicketsDao();

export class TicketsRepository {
  async create(ticketData) {
    return await dao.create(ticketData);
  }

  async findById(id) {
    return await dao.findById(id);
  }

  async findActiveByUserAndEvent(userId, eventId) {
    return await dao.findActiveByUserAndEvent(userId, eventId);
  }

  async getOccupiedQuota(eventId) {
    return await dao.getOccupiedQuota(eventId);
  }

  async findByUser(userId) {
    return await dao.findByUser(userId);
  }

  async findByEvent(eventId) {
    return await dao.findByEvent(eventId);
  }

  async update(id, updateData) {
    return await dao.update(id, updateData);
  }
}