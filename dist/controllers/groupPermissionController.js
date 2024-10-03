"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePermissionFromGroup = exports.listPermissionsForGroup = exports.assignPermissionsToGroup = void 0;
const groupPermission_1 = __importDefault(require("../models/groupPermission"));
const assignPermissionsToGroup = async (req, res) => {
    const { groupId } = req.params;
    const { modulePermissionId } = req.body;
    if (!modulePermissionId || !Array.isArray(modulePermissionId) || modulePermissionId.length === 0) {
        return res.status(400).json({ error: 'Permissions should be a non-empty array.' });
    }
    try {
        const updatedGroup = await groupPermission_1.default.findOneAndUpdate({ groupId }, { $set: { modulePermissionId } }, { new: true, upsert: true });
        if (!updatedGroup) {
            return res.status(404).json({ message: 'GroupPermission not found or created' });
        }
        return res.status(200).json({ message: 'Module permission assigned to group', updatedGroup });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
exports.assignPermissionsToGroup = assignPermissionsToGroup;
const listPermissionsForGroup = async (req, res) => {
    const { groupId } = req.params;
    const { page = '1', limit = '10' } = req.query;
    try {
        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.max(Number(limit), 1);
        const skip = (pageNumber - 1) * limitNumber;
        const groupPermissions = await groupPermission_1.default.find({ groupId })
            .populate('modulePermissionId')
            .populate('groupId', 'name')
            .skip(skip)
            .limit(limitNumber);
        const totalItems = await groupPermission_1.default.countDocuments({ groupId });
        const totalPages = Math.ceil(totalItems / limitNumber);
        if (groupPermissions.length === 0) {
            return res.status(404).json({ message: 'No permissions found for this group' });
        }
        return res.status(200).json({
            data: groupPermissions,
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalItems
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
exports.listPermissionsForGroup = listPermissionsForGroup;
const removePermissionFromGroup = async (req, res) => {
    const { groupId, modulePermissionid } = req.params;
    try {
        const result = await groupPermission_1.default.deleteOne({ groupId, modulePermissionid });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Permission not found for this group' });
        }
        return res.status(200).json({ message: 'Permission removed from group' });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
exports.removePermissionFromGroup = removePermissionFromGroup;
