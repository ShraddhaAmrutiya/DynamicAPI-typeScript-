"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissionController_1 = require("../controllers/permissionController");
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
const permissionmiddleware_1 = __importDefault(require("../middleware/permissionmiddleware"));
const router = express_1.default.Router();
router.use(authmiddleware_1.default);
router.post('/', (0, permissionmiddleware_1.default)('create'), permissionController_1.createPermission);
router.get('/', (0, permissionmiddleware_1.default)('read'), permissionController_1.listPermissions);
router.get('/:id', (0, permissionmiddleware_1.default)('read'), permissionController_1.getPermission);
router.put('/:id', (0, permissionmiddleware_1.default)('update'), permissionController_1.updatePermission);
router.delete('/:id', (0, permissionmiddleware_1.default)('delete'), permissionController_1.deletePermission);
exports.default = router;
