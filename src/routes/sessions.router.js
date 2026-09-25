import { Router } from 'express';
import { getSessions, register } from '../controllers/sessions.controller.js';

const router = Router();

router.get('/sessions', getSessions);
router.post('/sessions/register', register);

export default router;