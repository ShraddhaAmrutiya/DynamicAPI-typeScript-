import mongoose, {  Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import {IPermission} from '../types'

const permissionSchema: Schema<IPermission> = new Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true, unique: true, index: true },
  description: { type: String }
});

const PermissionModel = mongoose.model<IPermission>("Permission", permissionSchema);
export default PermissionModel;
