"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePermissionsFromModule = exports.listPermissionsForModule = exports.assignPermissionsToModule = exports.deletePermission = exports.updatePermission = exports.getPermission = exports.listPermissions = exports.createPermission = void 0;
const PermissionSchema_1 = __importDefault(require("../models/PermissionSchema"));
const modulePermission_1 = __importDefault(require("../models/modulePermission"));
const createPermission = async (req, res) => {
    const { name, description } = req.body;
    try {
        const permission = new PermissionSchema_1.default({ name, description });
        await permission.save();
        res.status(201).json(permission);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.createPermission = createPermission;
const listPermissions = async (req, res) => {
    const { page = '1', limit = '10' } = req.query;
    try {
        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.max(Number(limit), 1);
        const skip = (pageNumber - 1) * limitNumber;
        const permissions = await PermissionSchema_1.default.find().skip(skip).limit(limitNumber);
        const totalPermissions = await PermissionSchema_1.default.countDocuments();
        const totalPages = Math.ceil(totalPermissions / limitNumber);
        res.status(200).json({
            permissions,
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalPermissions,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.listPermissions = listPermissions;
const getPermission = async (req, res) => {
    const { id } = req.params;
    try {
        const permission = await PermissionSchema_1.default.findById(id);
        if (!permission)
            return res.status(404).json({ message: 'Permission not found' });
        res.status(200).json(permission);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getPermission = getPermission;
const updatePermission = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const permission = await PermissionSchema_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!permission)
            return res.status(404).json({ message: 'Permission not found' });
        res.status(200).json(permission);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updatePermission = updatePermission;
const deletePermission = async (req, res) => {
    const { id } = req.params;
    try {
        const permission = await PermissionSchema_1.default.findByIdAndDelete(id);
        if (!permission)
            return res.status(404).json({ message: 'Permission not found' });
        res.status(200).json({ message: 'Permission deleted' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deletePermission = deletePermission;
const assignPermissionsToModule = async (req, res) => {
    const { moduleId } = req.params;
    const { permissionIds } = req.body;
    if (!permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
        return res.status(400).json({ error: 'permissionIds should be a non-empty array.' });
    }
    try {
        let modulePermission = await modulePermission_1.default.findOne({ moduleId });
        if (modulePermission) {
            modulePermission.permissions = Array.from(new Set([...modulePermission.permissions, ...permissionIds]));
            await modulePermission.save();
        }
        else {
            await modulePermission_1.default.create({ moduleId, permissions: permissionIds });
        }
        res.status(200).json({ message: 'Permissions assigned to module' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.assignPermissionsToModule = assignPermissionsToModule;
const listPermissionsForModule = async (req, res) => {
    const { moduleId } = req.params;
    try {
        const modulePermissions = await modulePermission_1.default.findOne({ moduleId }).exec();
        if (!modulePermissions) {
            return res.status(404).json({ message: 'Permissions not found for this module' });
        }
        res.status(200).json(modulePermissions);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.listPermissionsForModule = listPermissionsForModule;
const removePermissionsFromModule = async (req, res) => {
    const { moduleId } = req.params;
    const { permissionIds } = req.body;
    if (!permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
        return res.status(400).json({ error: 'permissionIds should be a non-empty array.' });
    }
    try {
        let modulePermission = await modulePermission_1.default.findOne({ moduleId });
        if (!modulePermission) {
            return res.status(404).json({ message: 'Module permissions not found' });
        }
        modulePermission.permissions = modulePermission.permissions.filter((permission) => !permissionIds.includes(permission.toString()));
        await modulePermission.save();
        res.status(200).json({ message: 'Permissions removed from module', updatedPermissions: modulePermission.permissions });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.removePermissionsFromModule = removePermissionsFromModule;
