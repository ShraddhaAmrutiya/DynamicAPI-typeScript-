import { Request, Response, NextFunction } from 'express';
import GroupPermission from '../models/groupPermission'; 
import rolePermissions from '../rolePermission'; 
import { AuthenticatedRequest } from '../types';

const permissionMiddleware = (requiredPermission: string) => 
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user; 

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized: No user found.' });
      }

      const userRole = user.role;

      if (rolePermissions[userRole] && rolePermissions[userRole].includes(requiredPermission)) {
        return next(); }

      const groupPermissions = await GroupPermission.find({ groupId: { $in: user.groups } });

      const hasPermission = groupPermissions.some(group => group.modulePermissionId.includes(requiredPermission));

      if (hasPermission) {
        return next(); 
      }

      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
}; 

export default permissionMiddleware;
