import { Request, Response } from 'express';
import Group from '../models/GroupSchema'; 
import {CreateGroupRequestBody,UpdateGroupRequestBody,ListGroupsQuery} from '../types'



const createGroup = async (req: Request<{}, {}, CreateGroupRequestBody>, res: Response) => {
  const { name, description } = req.body;

  try {
    const groupExists = await Group.findOne({ name });
    if (groupExists) {
      return res.status(400).json({ message: "Group already exists" });
    }
    const group = new Group({ name, description });
    await group.save();
    res.status(201).json({message:"Group created successfully.",group});
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const listGroups = async (req: Request<{}, {}, {}, ListGroupsQuery>, res: Response) => {
  const { page = '1', limit = '10' } = req.query;

  try {
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const groups = await Group.find().skip(skip).limit(limitNumber);
    const totalGroups = await Group.countDocuments();
    const totalPages = Math.ceil(totalGroups / limitNumber);

    res.status(200).json({
      message:"List of Groups:",
      groups,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      totalGroups
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const getGroup = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const updateGroup = async (req: Request<{ id: string }, {}, UpdateGroupRequestBody>, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const group = await Group.findByIdAndUpdate(id, updates, { new: true });
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const deleteGroup = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const group = await Group.findByIdAndDelete(id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    res.status(200).json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const deleteAllGroups = async (req: Request, res: Response) => {
  try {
    const result = await Group.deleteMany({});
 
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No groups found to delete' });
    }
    
    res.status(200).json({ message: 'All groups deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export { createGroup, listGroups, getGroup, updateGroup, deleteGroup, deleteAllGroups };
