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
router.post('/modules/:moduleId/permissions', (0, permissionmiddleware_1.default)('update'), permissionController_1.assignPermissionsToModule);
router.get('/modules/:moduleId/permissions', (0, permissionmiddleware_1.default)('read'), permissionController_1.listPermissionsForModule);
router.delete('/modules/:moduleId/permissions', (0, permissionmiddleware_1.default)('update'), permissionController_1.removePermissionsFromModule);
exports.default = router;
