"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
const permissionmiddleware_1 = __importDefault(require("../middleware/permissionmiddleware"));
const router = express_1.default.Router();
router.use(authmiddleware_1.default);
router.post('/:userId/groups', (0, permissionmiddleware_1.default)('update'), userController_1.addUserToGroup);
router.delete('/:userId/groups/:groupId', (0, permissionmiddleware_1.default)('update'), userController_1.removeUserFromGroup);
exports.default = router;
