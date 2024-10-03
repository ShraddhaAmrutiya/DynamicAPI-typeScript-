import express, { Request, Response, NextFunction } from 'express';
import {
    createPermission,
    listPermissions,
    getPermission,
    updatePermission,
    deletePermission
} from '../controllers/permissionController';
import authMiddleware from '../middleware/authmiddleware';
import authorize from '../middleware/permissionmiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/', authorize('create'), createPermission);
router.get('/', authorize('read'), listPermissions);
router.get('/:id', authorize('read'), getPermission);
router.put('/:id', authorize('update'), updatePermission);
router.delete('/:id', authorize('delete'), deletePermission);

export default router;
