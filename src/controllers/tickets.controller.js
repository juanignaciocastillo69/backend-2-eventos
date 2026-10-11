import { TicketsService } from '../services/tickets.service.js';
import { toTicketDTO } from '../dto/ticket.dto.js';

const ticketsService = new TicketsService();

export const createTicket = async (req, res) => {
  const ticket = await ticketsService.createTicket(req.params.eid, req.body, req.user);
  res.status(201).json({ status: 'success', payload: toTicketDTO(ticket) });
};

export const cancelTicket = async (req, res) => {
  const ticket = await ticketsService.cancelTicket(req.params.tid, req.user);
  res.status(200).json({ status: 'success', payload: toTicketDTO(ticket) });
};

export const getMyTickets = async (req, res) => {
  const tickets = await ticketsService.getMyTickets(req.user.id);
  res.status(200).json({ status: 'success', payload: tickets.map(toTicketDTO) });
};

export const getEventTickets = async (req, res) => {
  const tickets = await ticketsService.getEventTickets(req.params.eid, req.user);
  res.status(200).json({ status: 'success', payload: tickets.map(toTicketDTO) });
};
