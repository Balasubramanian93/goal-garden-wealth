import { Router } from 'express';
import { register, login } from '../controllers/users';

const router = Router();

// POST /api/users/register - User registration
router.post('/register', register);

// POST /api/users/login - User login
router.post('/login', login);

export default router;