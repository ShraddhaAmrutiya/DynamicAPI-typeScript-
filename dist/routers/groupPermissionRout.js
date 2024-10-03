"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupPermissionController_1 = require("../controllers/groupPermissionController");
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
const permissionmiddleware_1 = __importDefault(require("../middleware/permissionmiddleware"));
const router = express_1.default.Router();
router.use(authmiddleware_1.default);
router.post('/:groupId/permissions', (0, permissionmiddleware_1.default)('update'), groupPermissionController_1.assignPermissionsToGroup);
router.get('/:groupId/permissions', (0, permissionmiddleware_1.default)('read'), groupPermissionController_1.listPermissionsForGroup);
router.delete('/:groupId/permissions/:modulePermissionId', (0, permissionmiddleware_1.default)('update'), groupPermissionController_1.removePermissionFromGroup);
exports.default = router;
