"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupController_1 = require("../controllers/groupController");
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
const permissionmiddleware_1 = __importDefault(require("../middleware/permissionmiddleware"));
const router = express_1.default.Router();
router.use(authmiddleware_1.default);
router.post('/', (0, permissionmiddleware_1.default)('create'), groupController_1.createGroup);
router.get('/', (0, permissionmiddleware_1.default)('read'), groupController_1.listGroups);
router.get('/:id', (0, permissionmiddleware_1.default)('read'), groupController_1.getGroup);
router.put('/:id', (0, permissionmiddleware_1.default)('update'), groupController_1.updateGroup);
router.delete('/:id', (0, permissionmiddleware_1.default)('delete'), groupController_1.deleteGroup);
router.delete('/', (0, permissionmiddleware_1.default)('delete'), groupController_1.deleteAllGroups);
exports.default = router;
