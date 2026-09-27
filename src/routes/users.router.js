import { Router } from 'express';
import { getAllUsers } from '../controllers/users.controller.js';
import { handlePassportAuth } from '../config/passport.config.js';
import { authorize } from '../middlewares/authorize.middleware.js';

const router = Router();

router.get('/users', handlePassportAuth('current'), authorize(['admin']), getAllUsers);

export default router;