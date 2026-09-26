import { Router } from 'express';
import { getSessions, register, login, current, logout } from '../controllers/sessions.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/sessions', getSessions);
router.post('/sessions/register', register);
router.post('/sessions/login', login);
router.get('/sessions/current', auth, current);
router.post('/sessions/logout', logout);

export default router;