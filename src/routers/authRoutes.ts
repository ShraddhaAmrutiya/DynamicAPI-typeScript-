import express from 'express';
import {registerUser, loginUser, refresh, readedUser, updateUser, deleteUser} from '../controllers/authController'; 
import authMiddleware from '../middleware/authmiddleware';
import authorize from '../middleware/permissionmiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refresh);
router.get('/', authMiddleware, authorize('read'), readedUser);
router.put('/:id', authMiddleware, authorize('update'), updateUser);
router.delete('/:id', authMiddleware, authorize('delete'),deleteUser);

export default router;
