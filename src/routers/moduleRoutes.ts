import express, { Request, Response, NextFunction } from 'express';
import {
    createModule,
    listModules,
    getModule,
    updateModule,
    deleteModule
} from '../controllers/moduleController';
import authMiddleware from '../middleware/authmiddleware';
import authorize from '../middleware/permissionmiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post("/", authorize("module_add"), createModule);

router.get("/", authorize("module_get"), listModules);
router.get("/:id", authorize("module_get"), getModule);

router.put("/:id", authorize("module_edit"), updateModule);

router.delete("/:id", authorize("module_delete"), deleteModule);

export default router;
