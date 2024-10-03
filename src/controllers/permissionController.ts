import { Request, Response } from 'express';
import Permission from '../models/PermissionSchema';
import ModulePermission from '../models/modulePermission';
import {PermissionRequestBody,AssignPermissionsRequestBody} from '../types'

const createPermission = async (req: Request<{}, {}, PermissionRequestBody>, res: Response) => {
  const { name, description } = req.body;

  try {
    const permission = new Permission({ name, description });
    await permission.save();
    res.status(201).json({message:"Permission created successfully:",permission});
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const listPermissions = async (req: Request, res: Response) => {
  const { page = '1', limit = '10' } = req.query;

  try {
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const permissions = await Permission.find().skip(skip).limit(limitNumber);
    const totalPermissions = await Permission.countDocuments();
    const totalPages = Math.ceil(totalPermissions / limitNumber);

    res.status(200).json({
      message:"List of permissions:",
      permissions,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      totalPermissions,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const getPermission = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const permission = await Permission.findById(id);
    if (!permission) return res.status(404).json({ message: 'Permission not found' });

    res.status(200).json({message:"list of permission:",permission});
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const updatePermission = async (req: Request<{ id: string }, {}, PermissionRequestBody>, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const permission = await Permission.findByIdAndUpdate(id, updates, { new: true });
    if (!permission) return res.status(404).json({ message: 'Permission not found' });

    res.status(200).json({message:"Updated permission:",permission});
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const deletePermission = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const permission = await Permission.findByIdAndDelete(id);
    if (!permission) return res.status(404).json({ message: 'Permission not found' });

    res.status(200).json({ message: 'Permission deleted' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};



const assignPermissionsToModule = async (
  req: Request<{ moduleId: string }, {}, { permissionIds: string[] }>,
  res: Response
) => {
  const { moduleId } = req.params;
  const { permissionIds } = req.body;
  if (!permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
    return res.status(400).json({ error: 'permissionIds should be a non-empty array.' });
  }

  try {
    let modulePermission = await ModulePermission.findOne({ moduleId });

    if (modulePermission) {
      modulePermission.permissions = Array.from(new Set([...modulePermission.permissions, ...permissionIds]));
      await modulePermission.save();
    } else {
      await ModulePermission.create({ moduleId, permissions: permissionIds });
    }

    res.status(200).json({ message: 'Permissions assigned to module' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
const listPermissionsForModule = async (req: Request<{ moduleId: string }>, res: Response) => {
  const { moduleId } = req.params;

  try {
    const modulePermissions = await ModulePermission.findOne({ moduleId }).exec();

    if (!modulePermissions) {
      return res.status(404).json({ message: 'Permissions not found for this module' });
    }

    res.status(200).json({message:"list of module permissions:",modulePermissions});
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};


const removePermissionsFromModule = async (req: Request<{ moduleId: string }, {}, AssignPermissionsRequestBody>, res: Response) => {
  const { moduleId } = req.params;
  const { permissionIds } = req.body;

  if (!permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
    return res.status(400).json({ error: 'permissionIds should be a non-empty array.' });
  }

  try {
    let modulePermission = await ModulePermission.findOne({ moduleId });

    if (!modulePermission) {
      return res.status(404).json({ message: 'Module permissions not found' });
    }

    modulePermission.permissions = modulePermission.permissions.filter(
      (permission) => !permissionIds.includes(permission.toString())
    );

    await modulePermission.save();

    res.status(200).json({ message: 'Permissions removed from module', updatedPermissions: modulePermission.permissions });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export {
  createPermission,
  listPermissions,
  getPermission,
  updatePermission,
  deletePermission,
  assignPermissionsToModule,
  listPermissionsForModule,
  removePermissionsFromModule
};
