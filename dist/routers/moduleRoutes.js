"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moduleController_1 = require("../controllers/moduleController");
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
const permissionmiddleware_1 = __importDefault(require("../middleware/permissionmiddleware"));
const router = express_1.default.Router();
router.use(authmiddleware_1.default);
router.post("/", (0, permissionmiddleware_1.default)("module_add"), moduleController_1.createModule);
router.get("/", (0, permissionmiddleware_1.default)("module_get"), moduleController_1.listModules);
router.get("/:id", (0, permissionmiddleware_1.default)("module_get"), moduleController_1.getModule);
router.put("/:id", (0, permissionmiddleware_1.default)("module_edit"), moduleController_1.updateModule);
router.delete("/:id", (0, permissionmiddleware_1.default)("module_delete"), moduleController_1.deleteModule);
exports.default = router;
