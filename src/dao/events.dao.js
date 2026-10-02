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

  async findWithFilters(filters, { page, limit, sort }) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Event.find(filters).sort(sort).skip(skip).limit(limit),
      Event.countDocuments(filters),
    ]);

    return { data, total };
  }
}