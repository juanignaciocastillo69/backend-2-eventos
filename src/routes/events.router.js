import { Router } from 'express';
import { getEvents, createEvent, updateEvent } from '../controllers/events.controller.js';
import { handlePassportAuth } from '../config/passport.config.js';
import { authorize } from '../middlewares/authorize.middleware.js';

const router = Router();

router.get('/events', getEvents);
router.post('/events', handlePassportAuth('current'), authorize(['organizer', 'admin']), createEvent);
router.put('/events/:id', handlePassportAuth('current'), authorize(['organizer', 'admin']), updateEvent);

export default router;