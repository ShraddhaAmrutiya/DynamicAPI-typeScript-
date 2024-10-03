import { Request, Response } from 'express';
import  {User } from '../models/UserSchema';
import Group from '../models/GroupSchema'; 
import {IGroup } from '../types'
import { IUser } from "../types";


const addUserToGroup = async (req: Request<{ userId: string }, {}, { groupIds: string[] }>, res: Response) => {
  const { userId } = req.params;
  const { groupIds } = req.body;

  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!Array.isArray(groupIds) || groupIds.length === 0) {
      return res.status(400).json({ message: 'groupIds should be a non-empty array' });
    }

    const groups: IGroup[] = await Group.find({ _id: { $in: groupIds } });
    const groupIdsInDb = groups.map(group => group._id.toString());

    const newGroupIds = groupIds.filter(groupId => 
      !user.groups.includes(groupId) && groupIdsInDb.includes(groupId)
    );

    if (newGroupIds.length > 0) {
      user.groups = [...user.groups, ...newGroupIds];  
      await user.save();
      return res.status(200).json({
        message: 'User added to groups successfully',
        addedGroups: newGroupIds,
      });
    } else {
      return res.status(400).json({
        message: 'User is already in the specified groups or some groups are invalid',
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

const removeUserFromGroup = async (req: Request<{ userId: string; groupId: string }>, res: Response) => {
  const { userId, groupId } = req.params;

  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.groups.includes(groupId)) {
      return res.status(400).json({ message: 'User not in group' });
    }
    user.groups = user.groups.filter((group) => group.toString() !== groupId);
    await user.save();

    res.status(200).json({ message: 'User removed from group', name:user.username });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export { addUserToGroup, removeUserFromGroup };
