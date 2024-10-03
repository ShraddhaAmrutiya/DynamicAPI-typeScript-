import { Request, Response } from 'express';
import Module from '../models/moduleSchema';
import{CreateModuleRequestBody,UpdateModuleRequestBody,ListModulesQuery}from '../types'


const createModule = async (req: Request<{}, {}, CreateModuleRequestBody>, res: Response) => {
  const { name, description } = req.body;
  
  try {
    const existingModule = await Module.findOne({ name });
    if (existingModule) {
      return res.status(400).json({ error: 'Module already exists' });
    }
    const module = new Module({ name, description });
    await module.save();
    res.status(201).json({message:"Module created successfully.",module});
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const listModules = async (req: Request<{}, {}, {}, ListModulesQuery>, res: Response) => {
  const { page = '1', limit = '10' } = req.query;

  try {
    const pageNumber = Math.max(parseInt(page, 10), 1);
    const limitNumber = Math.max(parseInt(limit, 10), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const modules = await Module.find().skip(skip).limit(limitNumber);
    const totalModules = await Module.countDocuments();
    const totalPages = Math.ceil(totalModules / limitNumber);

    res.status(200).json({
      message:"list of modules:",
      modules,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      totalModules
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const getModule = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  
  try {
    const module = await Module.findById(id);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    
    res.status(200).json({message:"list of module:",module});
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const updateModule = async (req: Request<{ id: string }, {}, UpdateModuleRequestBody>, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const module = await Module.findByIdAndUpdate(id, updates, { new: true });
    if (!module) return res.status(404).json({ message: 'Module not found' });
    
    res.status(200).json({message:"Updated module :",module});
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const deleteModule = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  
  try {
    const module = await Module.findByIdAndDelete(id);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    
    res.status(200).json({ message: 'Module deleted' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export {
  createModule,
  listModules,
  getModule,
  updateModule,
  deleteModule
};
