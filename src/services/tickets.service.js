import crypto from 'crypto';
import { TicketsRepository } from '../repositories/tickets.repository.js';
import { EventsRepository } from '../repositories/events.repository.js';
import { sendTicketConfirmationEmail } from '../utils/mailer.js';

const ticketsRepository = new TicketsRepository();
const eventsRepository = new EventsRepository();

export class TicketsService {
  async createTicket(eventId, { quantity }, user) {
    const event = await eventsRepository.findById(eventId);

    if (!event) {
      const error = new Error('Evento no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (event.status !== 'published') {
      const error = new Error('El evento no está disponible para inscripciones');
      error.statusCode = 400;
      throw error;
    }

    const parsedQuantity = Number(quantity);
    if (!quantity || isNaN(parsedQuantity) || parsedQuantity <= 0) {
      const error = new Error('La cantidad debe ser un número mayor a 0');
      error.statusCode = 400;
      throw error;
    }

    const existingTicket = await ticketsRepository.findActiveByUserAndEvent(user.id, eventId);
    if (existingTicket) {
      const error = new Error('Ya tenés una inscripción activa para este evento');
      error.statusCode = 400;
      throw error;
    }

    const occupied = await ticketsRepository.getOccupiedQuota(eventId);
    const available = event.capacity - occupied;

    if (available < parsedQuantity) {
      const error = new Error(`No hay cupos suficientes. Disponibles: ${available}`);
      error.statusCode = 400;
      throw error;
    }

    const reservationCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const newTicket = await ticketsRepository.create({
      user: user.id,
      event: eventId,
      quantity: parsedQuantity,
      reservationCode,
      status: 'confirmed',
    });

    try {
      await sendTicketConfirmationEmail(user.email, event.title);
    } catch (error) {
      console.error('Error al enviar el email de confirmación:', error.message);
    }

    return newTicket;
  }

  async cancelTicket(ticketId, user) {
    const ticket = await ticketsRepository.findById(ticketId);

    if (!ticket) {
      const error = new Error('Ticket no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const isOwner = ticket.user.toString() === user.id;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      const error = new Error('No podés cancelar un ticket que no te pertenece');
      error.statusCode = 403;
      throw error;
    }

    if (ticket.status === 'cancelled') {
      const error = new Error('El ticket ya está cancelado');
      error.statusCode = 400;
      throw error;
    }

    const updatedTicket = await ticketsRepository.update(ticketId, {
      status: 'cancelled',
      cancelledAt: new Date(),
    });

    return updatedTicket;
  }

  async getMyTickets(userId) {
    return await ticketsRepository.findByUser(userId);
  }

  async getEventTickets(eventId, user) {
    const event = await eventsRepository.findById(eventId);

    if (!event) {
      const error = new Error('Evento no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const isOwner = event.organizer.toString() === user.id;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      const error = new Error('No tenés permisos para ver las inscripciones de este evento');
      error.statusCode = 403;
      throw error;
    }

    return await ticketsRepository.findByEvent(eventId);
  }
}