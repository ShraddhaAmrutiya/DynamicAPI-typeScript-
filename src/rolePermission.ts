type Role = 'superadmin' | 'admin' | 'user';

interface RolePermissions {
    [key: string]: string[];
}

const rolePermissions: RolePermissions = {
  superadmin: ['create', 'read', 'update', 'delete', 'module_add', 'module_get', 'module_edit', 'module_delete'],
  admin: ['read', 'update', 'delete', 'module_get', 'module_edit', 'module_add', 'module_delete'],
  user: ['module_get'],
};

export default rolePermissions;
