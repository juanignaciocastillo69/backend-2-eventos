import { Router } from 'express';
import { handlePassportAuth } from '../config/passport.config.js';
import { getSessions, register, login, current, logout } from '../controllers/sessions.controller.js';

const router = Router();

router.get('/sessions', getSessions);
router.post('/sessions/register', handlePassportAuth('register'), register);
router.post('/sessions/login', handlePassportAuth('login'), login);
router.get('/sessions/current', handlePassportAuth('current'), current);
router.post('/sessions/logout', logout);

export default router;