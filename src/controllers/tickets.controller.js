import { TicketsService } from '../services/tickets.service.js';

const ticketsService = new TicketsService();

export const createTicket = async (req, res) => {
  try {
    const newTicket = await ticketsService.createTicket(req.params.eid, req.body, req.user);
    res.status(201).json({ status: 'success', payload: newTicket });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const cancelTicket = async (req, res) => {
  try {
    const cancelledTicket = await ticketsService.cancelTicket(req.params.tid, req.user);
    res.status(200).json({ status: 'success', payload: cancelledTicket });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await ticketsService.getMyTickets(req.user.id);
    res.status(200).json({ status: 'success', payload: tickets });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener tus tickets' });
  }
};

export const getEventTickets = async (req, res) => {
  try {
    const tickets = await ticketsService.getEventTickets(req.params.eid, req.user);
    res.status(200).json({ status: 'success', payload: tickets });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};