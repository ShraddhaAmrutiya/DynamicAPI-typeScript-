import { Request, Response } from 'express';
import GroupPermission from '../models/groupPermission';
import {AssignPermissionsRequestBody,ListPermissionsQuery,RemovePermissionParams} from '../types'
 


const assignPermissionsToGroup = async (req: Request<{ groupId: string }, {}, AssignPermissionsRequestBody>, res: Response) => {
  const { groupId } = req.params;
  const { modulePermissionId } = req.body;

  if (!modulePermissionId || !Array.isArray(modulePermissionId) || modulePermissionId.length === 0) {
    return res.status(400).json({ error: 'Permissions should be a non-empty array.' });
  }

  try {
    const updatedGroup = await GroupPermission.findOneAndUpdate(
      { groupId },
      { $set: { modulePermissionId } },
      { new: true, upsert: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: 'GroupPermission not found or created' });
    }

    return res.status(200).json({ message: 'Module permission assigned to group',updatedGroup });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

const listPermissionsForGroup = async (req: Request<{ groupId: string }, {}, {}, ListPermissionsQuery>, res: Response) => {
  const { groupId } = req.params;
  const { page = '1', limit = '10' } = req.query;

  try {
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const groupPermissions = await GroupPermission.find({ groupId })
      .populate('modulePermissionId')
      .populate('groupId', 'name')
      .skip(skip)
      .limit(limitNumber);

    const totalItems = await GroupPermission.countDocuments({ groupId });
    const totalPages = Math.ceil(totalItems / limitNumber);

    if (groupPermissions.length === 0) {
      return res.status(404).json({ message: 'No permissions found for this group' });
    }

    return res.status(200).json({
      message:"list of GroupPermission",
      data: groupPermissions,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      totalItems
    });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};


const removePermissionFromGroup = async (
    req: Request<RemovePermissionParams, {}, {}, {}>,  res: Response
  ) => {
    const { groupId, modulePermissionid } = req.params;
  
    try {
      const result = await GroupPermission.deleteOne({ groupId, modulePermissionid });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Permission not found for this group' });
      }
      return res.status(200).json({ message: 'Permission removed from group' });
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message });
    }
  };
  
  
  
  

export {
  assignPermissionsToGroup,
  listPermissionsForGroup,
  removePermissionFromGroup
};
