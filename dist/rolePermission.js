"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rolePermissions = {
    superadmin: ['create', 'read', 'update', 'delete', 'module_add', 'module_get', 'module_edit', 'module_delete'],
    admin: ['read', 'update', 'delete', 'module_get', 'module_edit', 'module_add', 'module_delete'],
    user: ['module_get'],
};
exports.default = rolePermissions;
