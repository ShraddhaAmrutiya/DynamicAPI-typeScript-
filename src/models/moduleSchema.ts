import mongoose, {  Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import{IModule} from '../types'

const moduleSchema: Schema<IModule> = new Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  createdAt: { type: Date, default: Date.now },
});

const Module = mongoose.model<IModule>("Module", moduleSchema);
export default Module;
