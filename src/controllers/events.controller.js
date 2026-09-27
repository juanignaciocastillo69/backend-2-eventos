import { EventsService } from '../services/events.service.js';

const eventsService = new EventsService();

export const getEvents = (req, res) => {
  res.json({ status: 'success', payload: [] });
};

export const createEvent = async (req, res) => {
  try {
    const newEvent = await eventsService.createEvent(req.body, req.user.id);
    res.status(201).json({
      status: 'success',
      payload: {
        id: newEvent._id,
        title: newEvent.title,
        organizer: newEvent.organizer,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await eventsService.updateEvent(req.params.id, req.body, req.user);
    res.status(200).json({
      status: 'success',
      payload: {
        id: updatedEvent._id,
        title: updatedEvent.title,
        organizer: updatedEvent.organizer,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};