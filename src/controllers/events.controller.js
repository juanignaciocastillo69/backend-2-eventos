import { EventsService } from '../services/events.service.js';
import { toEventDTO } from '../dto/event.dto.js';

const eventsService = new EventsService();

export const createEvent = async (req, res) => {
  const event = await eventsService.createEvent(req.body, req.user.id);
  res.status(201).json({ status: 'success', payload: toEventDTO(event) });
};

export const getEvents = async (req, res) => {
  const result = await eventsService.listEvents(req.query);
  res.status(200).json({ status: 'success', ...result, data: result.data.map(toEventDTO) });
};

export const getEventById = async (req, res) => {
  const event = await eventsService.getEventById(req.params.id);
  res.status(200).json({ status: 'success', payload: toEventDTO(event) });
};

export const updateEvent = async (req, res) => {
  const event = await eventsService.updateEvent(req.params.id, req.body, req.user);
  res.status(200).json({ status: 'success', payload: toEventDTO(event) });
};

export const updateEventStatus = async (req, res) => {
  const event = await eventsService.updateEventStatus(req.params.id, req.body.status, req.user);
  res.status(200).json({ status: 'success', payload: toEventDTO(event) });
};
