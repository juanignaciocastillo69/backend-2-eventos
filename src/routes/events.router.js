import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  updateEventStatus,
} from '../controllers/events.controller.js';
import { handlePassportAuth } from '../config/passport.config.js';
import { authorize } from '../middlewares/authorize.middleware.js';

const router = Router();

router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.post('/events', handlePassportAuth('current'), authorize(['organizer', 'admin']), createEvent);
router.put('/events/:id', handlePassportAuth('current'), authorize(['organizer', 'admin']), updateEvent);
router.patch('/events/:id/status', handlePassportAuth('current'), authorize(['organizer', 'admin']), updateEventStatus);

export default router;