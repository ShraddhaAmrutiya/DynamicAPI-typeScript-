import express from 'express';
import {addUserToGroup,removeUserFromGroup} from '../controllers/userController';
import authMiddleware from '../middleware/authmiddleware';
import authorize from '../middleware/permissionmiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/:userId/groups',
  authorize('update'),
  addUserToGroup
);

router.delete(
  '/:userId/groups/:groupId',
  authorize('update'),
  removeUserFromGroup
);

export default router;
