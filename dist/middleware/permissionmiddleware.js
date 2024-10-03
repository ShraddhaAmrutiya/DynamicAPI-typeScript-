"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const groupPermission_1 = __importDefault(require("../models/groupPermission"));
const rolePermission_1 = __importDefault(require("../rolePermission"));
const permissionMiddleware = (requiredPermission) => async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: No user found.' });
        }
        const userRole = user.role;
        if (rolePermission_1.default[userRole] && rolePermission_1.default[userRole].includes(requiredPermission)) {
            return next();
        }
        const groupPermissions = await groupPermission_1.default.find({ groupId: { $in: user.groups } });
        const hasPermission = groupPermissions.some(group => group.modulePermissionId.includes(requiredPermission));
        if (hasPermission) {
            return next();
        }
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.default = permissionMiddleware;
