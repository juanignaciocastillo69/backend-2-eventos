import { EventsRepository } from '../repositories/events.repository.js';

const eventsRepository = new EventsRepository();

export class EventsService {
  async createEvent({ title }, organizerId) {
    if (!title) {
      const error = new Error('El título es obligatorio');
      error.statusCode = 400;
      throw error;
    }

    const newEvent = await eventsRepository.create({
      title,
      organizer: organizerId,
    });

    return newEvent;
  }

  async updateEvent(id, updateData, user) {
    const event = await eventsRepository.findById(id);

    if (!event) {
      const error = new Error('Evento no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const isOwner = event.organizer.toString() === user.id;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      const error = new Error('No podés modificar un evento que no te pertenece');
      error.statusCode = 403;
      throw error;
    }

    const updatedEvent = await eventsRepository.update(id, updateData);
    return updatedEvent;
  }
}