import express, { Request, Response } from 'express';
import { 
  assignPermissionsToGroup, 
  listPermissionsForGroup, 
  removePermissionFromGroup 
} from '../controllers/groupPermissionController';
import authMiddleware from '../middleware/authmiddleware';
import authorize from '../middleware/permissionmiddleware';
interface RemovePermissionParams {
  groupId: string;
  modulePermissionid: string;
}
const router = express.Router();

router.use(authMiddleware);

router.post(
  '/:groupId/permissions', 
  authorize('update'), 
  assignPermissionsToGroup
);

router.get(
  '/:groupId/permissions', 
  authorize('read'), 
  listPermissionsForGroup
);


router.delete(
  '/:groupId/permissions/:modulePermissionId', 
  authorize('update'), 
  removePermissionFromGroup
);

export default router;
