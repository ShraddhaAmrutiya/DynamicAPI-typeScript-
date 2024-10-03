
import { Request } from 'express';
import mongoose, { Document } from 'mongoose';
import { ParamsDictionary } from 'express-serve-static-core';


export interface AuthenticatedUser {
  id: string; 
  role: string;     
  groups: string[]; 
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser; 
}


export interface IGroupPermission extends Document {
  _id: string;
  groupId: mongoose.Schema.Types.String; 
  modulePermissionId: String[]; 
}

export interface IGroup extends Document{
  _id:string;
  name:string;
  description?:string;
  createdAt:Date
}
 export interface IModulePermission extends Document {
  _id: string;
  moduleId: string; 
  permissions: string[];
}

export interface IModule extends Document {
  _id: string;
  name: string;
  description?: string; 
  createdBy: mongoose.Schema.Types.ObjectId; 
  createdAt: Date;
}

export interface IPermission extends Document {
  _id: string;
  name: string;
  description?: string

}

export interface IUserPermission extends Document {
  _id: string;
  userId: mongoose.Schema.Types.ObjectId;
  permissions: string[];
}

export interface IUser extends Document {
  _id: string;
  username: string;
  password: string;
  role: "superadmin" | "admin" | "user";
  groups: string[];
  matchPassword(password: string): Promise<boolean>;
}

export interface RegisterRequestBody {
  username: string;
  password: string;
  role?: string;
}

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface RefreshRequestBody {
  refreshToken: string;
} 
export interface AuthenticatedUser {
    id: string;
    role: string;
  }
  
  export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser; 
  }
  
  export interface UpdateRequestBody {
    role?: string;
    username?: string;
    email?: string;
  }
  
export interface CreateGroupRequestBody {
  name: string;
  description: string;
}

export interface UpdateGroupRequestBody {
  name?: string; 
  description?: string; 
}

export interface ListGroupsQuery {
  page?: string;
  limit?: string;
}

export interface AssignPermissionsRequestBody {
  modulePermissionId: string[];
}

export interface ListPermissionsQuery {
  page?: string;
  limit?: string;
}

export interface RemovePermissionParams extends ParamsDictionary {
    groupId: string;
    modulePermissionid: string;
  }
  
export interface CreateModuleRequestBody {
  name: string;
  description: string;
}

export interface UpdateModuleRequestBody {
  name?: string;
  description?: string;
}

export interface ListModulesQuery {
  page?: string;
  limit?: string;
}

export interface PermissionRequestBody {
  name: string;
  description: string;
}

export interface AssignPermissionsRequestBody {
  permissionIds: string[];
}
