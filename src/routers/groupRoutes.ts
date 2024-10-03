import express, { Request, Response } from 'express';
import {createGroup, listGroups, getGroup, updateGroup, deleteGroup, deleteAllGroups} from '../controllers/groupController';
import authMiddleware from '../middleware/authmiddleware';
import authorize from '../middleware/permissionmiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/', authorize('create'), createGroup);

router.get('/', authorize('read'), listGroups);

router.get('/:id', authorize('read'), getGroup);

router.put('/:id', authorize('update'), updateGroup);

router.delete('/:id', authorize('delete'), deleteGroup);

router.delete('/', authorize('delete'), deleteAllGroups);

export default router;
