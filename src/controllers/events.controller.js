import { EventsService } from '../services/events.service.js';

const eventsService = new EventsService();

export const createEvent = async (req, res) => {
  try {
    const newEvent = await eventsService.createEvent(req.body, req.user.id);
    res.status(201).json({ status: 'success', payload: newEvent });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const result = await eventsService.listEvents(req.query);
    res.status(200).json({ status: 'success', ...result });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await eventsService.getEventById(req.params.id);
    res.status(200).json({ status: 'success', payload: event });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await eventsService.updateEvent(req.params.id, req.body, req.user);
    res.status(200).json({ status: 'success', payload: updatedEvent });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const updatedEvent = await eventsService.updateEventStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ status: 'success', payload: updatedEvent });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};