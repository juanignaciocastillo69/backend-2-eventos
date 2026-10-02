import Ticket from '../models/Ticket.js';

export class TicketsDao {
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  async findById(id) {
    return await Ticket.findById(id);
  }

  async findActiveByUserAndEvent(userId, eventId) {
    return await Ticket.findOne({
      user: userId,
      event: eventId,
      status: { $ne: 'cancelled' },
    });
  }

  async getOccupiedQuota(eventId) {
    const result = await Ticket.aggregate([
      { $match: { event: eventId, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async findByUser(userId) {
    return await Ticket.find({ user: userId }).populate('event', 'title date location');
  }

  async findByEvent(eventId) {
    return await Ticket.find({ event: eventId }).populate('user', 'first_name last_name email');
  }

  async update(id, updateData) {
    return await Ticket.findByIdAndUpdate(id, updateData, { new: true });
  }
}