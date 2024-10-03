import { v4 as uuidv4 } from "uuid";
import mongoose,{Schema} from "mongoose";
import {IGroup } from '../types'


const groupSchema:Schema<IGroup>= new Schema({
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
})

const Group = mongoose.model<IGroup>("Group", groupSchema);
export default Group;