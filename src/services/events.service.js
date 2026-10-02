import { EventsRepository } from '../repositories/events.repository.js';

const eventsRepository = new EventsRepository();

export class EventsService {
  async createEvent(eventData, organizerId) {
    const { title, description, category, date, location, capacity, price } = eventData;

    if (!title || !description || !category || !location) {
      const error = new Error('Faltan campos obligatorios: title, description, category, location');
      error.statusCode = 400;
      throw error;
    }

    if (!date || new Date(date) < new Date()) {
      const error = new Error('La fecha del evento no puede ser pasada');
      error.statusCode = 400;
      throw error;
    }

    if (capacity === undefined || capacity <= 0) {
      const error = new Error('La capacidad debe ser mayor a 0');
      error.statusCode = 400;
      throw error;
    }

    if (price === undefined || price < 0) {
      const error = new Error('El precio no puede ser negativo');
      error.statusCode = 400;
      throw error;
    }

    const newEvent = await eventsRepository.create({
      title,
      description,
      category,
      date,
      location,
      capacity,
      price,
      organizer: organizerId,
    });

    return newEvent;
  }

  async getEventById(id) {
    const event = await eventsRepository.findById(id);

    if (!event) {
      const error = new Error('Evento no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return event;
  }

  async updateEvent(id, updateData, user) {
    const event = await this.getEventById(id);

    const isOwner = event.organizer.toString() === user.id;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      const error = new Error('No podés modificar un evento que no te pertenece');
      error.statusCode = 403;
      throw error;
    }

    if (event.status === 'cancelled') {
      const error = new Error('No se puede modificar un evento cancelado');
      error.statusCode = 400;
      throw error;
    }

    const updatedEvent = await eventsRepository.update(id, updateData);
    return updatedEvent;
  }

  async updateEventStatus(id, newStatus, user) {
    const event = await this.getEventById(id);

    const isOwner = event.organizer.toString() === user.id;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      const error = new Error('No podés modificar un evento que no te pertenece');
      error.statusCode = 403;
      throw error;
    }

    if (event.status === 'cancelled') {
      const error = new Error('No se puede modificar un evento cancelado');
      error.statusCode = 400;
      throw error;
    }

    if (newStatus === 'published' && (event.status === 'finished' || event.status === 'cancelled')) {
      const error = new Error('No se puede publicar un evento finalizado o cancelado');
      error.statusCode = 400;
      throw error;
    }

    const updatedEvent = await eventsRepository.update(id, { status: newStatus });
    return updatedEvent;
  }

  async listEvents(queryParams) {
    const { status, category, location, dateFrom, dateTo, page = 1, limit = 10, sort } = queryParams;

    const filters = {};

    if (status) filters.status = status;
    if (category) filters.category = category;
    if (location) filters.location = location;

    if (dateFrom || dateTo) {
      filters.date = {};
      if (dateFrom) filters.date.$gte = new Date(dateFrom);
      if (dateTo) filters.date.$lte = new Date(dateTo);
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const { data, total } = await eventsRepository.findWithFilters(filters, {
      page: pageNumber,
      limit: limitNumber,
      sort: sort || '-date',
    });

    return {
      data,
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    };
  }
}