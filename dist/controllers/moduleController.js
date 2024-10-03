"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteModule = exports.updateModule = exports.getModule = exports.listModules = exports.createModule = void 0;
const moduleSchema_1 = __importDefault(require("../models/moduleSchema"));
const createModule = async (req, res) => {
    const { name, description } = req.body;
    try {
        const existingModule = await moduleSchema_1.default.findOne({ name });
        if (existingModule) {
            return res.status(400).json({ error: 'Module already exists' });
        }
        const module = new moduleSchema_1.default({ name, description });
        await module.save();
        res.status(201).json(module);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.createModule = createModule;
const listModules = async (req, res) => {
    const { page = '1', limit = '10' } = req.query;
    try {
        const pageNumber = Math.max(parseInt(page, 10), 1);
        const limitNumber = Math.max(parseInt(limit, 10), 1);
        const skip = (pageNumber - 1) * limitNumber;
        const modules = await moduleSchema_1.default.find().skip(skip).limit(limitNumber);
        const totalModules = await moduleSchema_1.default.countDocuments();
        const totalPages = Math.ceil(totalModules / limitNumber);
        res.status(200).json({
            modules,
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalModules
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.listModules = listModules;
const getModule = async (req, res) => {
    const { id } = req.params;
    try {
        const module = await moduleSchema_1.default.findById(id);
        if (!module)
            return res.status(404).json({ message: 'Module not found' });
        res.status(200).json(module);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getModule = getModule;
const updateModule = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const module = await moduleSchema_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!module)
            return res.status(404).json({ message: 'Module not found' });
        res.status(200).json(module);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateModule = updateModule;
const deleteModule = async (req, res) => {
    const { id } = req.params;
    try {
        const module = await moduleSchema_1.default.findByIdAndDelete(id);
        if (!module)
            return res.status(404).json({ message: 'Module not found' });
        res.status(200).json({ message: 'Module deleted' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteModule = deleteModule;
