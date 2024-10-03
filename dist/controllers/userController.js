"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserFromGroup = exports.addUserToGroup = void 0;
const UserSchema_1 = require("../models/UserSchema");
const GroupSchema_1 = __importDefault(require("../models/GroupSchema"));
const addUserToGroup = async (req, res) => {
    const { userId } = req.params;
    const { groupIds } = req.body;
    try {
        const user = await UserSchema_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!Array.isArray(groupIds) || groupIds.length === 0) {
            return res.status(400).json({ message: 'groupIds should be a non-empty array' });
        }
        const groups = await GroupSchema_1.default.find({ _id: { $in: groupIds } });
        const groupIdsInDb = groups.map(group => group._id.toString());
        const newGroupIds = groupIds.filter(groupId => !user.groups.includes(groupId) && groupIdsInDb.includes(groupId));
        if (newGroupIds.length > 0) {
            user.groups = [...user.groups, ...newGroupIds];
            await user.save();
            return res.status(200).json({
                message: 'User added to groups successfully',
                addedGroups: newGroupIds,
            });
        }
        else {
            return res.status(400).json({
                message: 'User is already in the specified groups or some groups are invalid',
            });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.addUserToGroup = addUserToGroup;
const removeUserFromGroup = async (req, res) => {
    const { userId, groupId } = req.params;
    try {
        const user = await UserSchema_1.User.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        if (!user.groups.includes(groupId)) {
            return res.status(400).json({ message: 'User not in group' });
        }
        user.groups = user.groups.filter((group) => group.toString() !== groupId);
        await user.save();
        res.status(200).json({ message: 'User removed from group', name: user.username });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.removeUserFromGroup = removeUserFromGroup;
