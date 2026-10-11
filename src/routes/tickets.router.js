import { Router } from 'express';
import { getMyTickets, cancelTicket } from '../controllers/tickets.controller.js';
import { handlePassportAuth } from '../middlewares/passport-auth.middleware.js';

const router = Router();

router.get('/tickets/my-tickets', handlePassportAuth('current'), getMyTickets);
router.patch('/tickets/:tid/cancel', handlePassportAuth('current'), cancelTicket);

export default router;