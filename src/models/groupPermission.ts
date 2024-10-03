import mongoose, {  Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {IGroupPermission} from '../types'

const groupPermissionSchema: Schema<IGroupPermission> = new Schema({
  _id: { type: String, default: uuidv4 },
  groupId: { type: mongoose.Schema.Types.String, ref: 'Group', required: true },
  modulePermissionId: [{ type: String, ref: 'ModulePermission' }], 
});

const GroupPermissionModel = mongoose.model<IGroupPermission>('GroupPermission', groupPermissionSchema);
export default GroupPermissionModel;
