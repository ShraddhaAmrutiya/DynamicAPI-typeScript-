import mongoose, {  Schema  } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {IModulePermission} from '../types'


const modulePermissionSchema: Schema<IModulePermission> = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  moduleId: { 
    type: String,
    ref: 'Module', 
    required: true 
  },
  permissions: [{ 
    type: String, 
    ref: 'Permission' 
  }],
});

const ModulePermissionModel = mongoose.model<IModulePermission>('ModulePermission', modulePermissionSchema);
export default ModulePermissionModel;
