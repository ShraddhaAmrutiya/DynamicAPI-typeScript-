"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
const permissionmiddleware_1 = __importDefault(require("../middleware/permissionmiddleware"));
const router = express_1.default.Router();
router.post('/register', authController_1.registerUser);
router.post('/login', authController_1.loginUser);
router.post('/refresh', authController_1.refresh);
router.get('/', authmiddleware_1.default, (0, permissionmiddleware_1.default)('read'), authController_1.readedUser);
router.put('/:id', authmiddleware_1.default, (0, permissionmiddleware_1.default)('update'), authController_1.updateUser);
router.delete('/:id', authmiddleware_1.default, (0, permissionmiddleware_1.default)('delete'), authController_1.deleteUser);
exports.default = router;
