import mongoose, {  Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import {IUserPermission} from '../types'

const userPermissionSchema: Schema<IUserPermission> = new Schema({
  _id: { type: String, default: uuidv4 },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  permissions: [{ type: String, ref: 'Permission' }],
});

const UserPermissionModel = mongoose.model<IUserPermission>("UserPermission", userPermissionSchema);
export default UserPermissionModel;
