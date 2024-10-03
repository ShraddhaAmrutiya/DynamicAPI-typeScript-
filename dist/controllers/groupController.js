"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllGroups = exports.deleteGroup = exports.updateGroup = exports.getGroup = exports.listGroups = exports.createGroup = void 0;
const GroupSchema_1 = __importDefault(require("../models/GroupSchema"));
const createGroup = async (req, res) => {
    const { name, description } = req.body;
    try {
        const groupExists = await GroupSchema_1.default.findOne({ name });
        if (groupExists) {
            return res.status(400).json({ message: "Group already exists" });
        }
        const group = new GroupSchema_1.default({ name, description });
        await group.save();
        res.status(201).json(group);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.createGroup = createGroup;
const listGroups = async (req, res) => {
    const { page = '1', limit = '10' } = req.query;
    try {
        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.max(Number(limit), 1);
        const skip = (pageNumber - 1) * limitNumber;
        const groups = await GroupSchema_1.default.find().skip(skip).limit(limitNumber);
        const totalGroups = await GroupSchema_1.default.countDocuments();
        const totalPages = Math.ceil(totalGroups / limitNumber);
        res.status(200).json({
            groups,
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            totalGroups
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.listGroups = listGroups;
const getGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await GroupSchema_1.default.findById(id);
        if (!group)
            return res.status(404).json({ message: 'Group not found' });
        res.status(200).json(group);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getGroup = getGroup;
const updateGroup = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const group = await GroupSchema_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!group)
            return res.status(404).json({ message: 'Group not found' });
        res.status(200).json(group);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateGroup = updateGroup;
const deleteGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await GroupSchema_1.default.findByIdAndDelete(id);
        if (!group)
            return res.status(404).json({ message: 'Group not found' });
        res.status(200).json({ message: 'Group deleted' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteGroup = deleteGroup;
const deleteAllGroups = async (req, res) => {
    try {
        const result = await GroupSchema_1.default.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No groups found to delete' });
        }
        res.status(200).json({ message: 'All groups deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteAllGroups = deleteAllGroups;
