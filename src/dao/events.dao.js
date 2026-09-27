import Event from '../models/Event.js';

export class EventsDao {
  async create(eventData) {
    return await Event.create(eventData);
  }

  async findById(id) {
    return await Event.findById(id);
  }

  async update(id, updateData) {
    return await Event.findByIdAndUpdate(id, updateData, { new: true });
  }
}