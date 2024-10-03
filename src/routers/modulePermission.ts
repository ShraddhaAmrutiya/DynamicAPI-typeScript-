import express, { Request, Response, NextFunction } from 'express';
import {
    assignPermissionsToModule,
    listPermissionsForModule,
    removePermissionsFromModule
} from '../controllers/permissionController';
import authMiddleware from '../middleware/authmiddleware';
import authorize from '../middleware/permissionmiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post(
    '/modules/:moduleId/permissions',
    authorize('update'),
    assignPermissionsToModule
);

router.get(
    '/modules/:moduleId/permissions',
    authorize('read'),
    listPermissionsForModule
);

router.delete(
    '/modules/:moduleId/permissions',
    authorize('update'),
    removePermissionsFromModule
);

export default router;
