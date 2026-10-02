import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  updateEventStatus,
} from '../controllers/events.controller.js';
import { createTicket, getEventTickets } from '../controllers/tickets.controller.js';
import { handlePassportAuth } from '../config/passport.config.js';
import { authorize } from '../middlewares/authorize.middleware.js';

const router = Router();

router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.post('/events', handlePassportAuth('current'), authorize(['organizer', 'admin']), createEvent);
router.put('/events/:id', handlePassportAuth('current'), authorize(['organizer', 'admin']), updateEvent);
router.patch('/events/:id/status', handlePassportAuth('current'), authorize(['organizer', 'admin']), updateEventStatus);

router.post('/events/:eid/tickets', handlePassportAuth('current'), createTicket);
router.get('/events/:eid/tickets', handlePassportAuth('current'), authorize(['organizer', 'admin']), getEventTickets);

export default router;