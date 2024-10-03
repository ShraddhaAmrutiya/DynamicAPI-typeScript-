import mongoose, {  Schema, model,Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from 'bcryptjs';
import { IUser } from "../types";

const userSchema: Schema<IUser> = new Schema({
  _id: { type: String, default: uuidv4 },
  username: { 
    type: String, 
    required: [true, 'Username is required'], 
    unique: true, 
    trim: true,
    match: [ /^[a-zA-Z0-9._-]{3,50}$/, 'Please enter a valid user name.'],
    index: true,
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'], 
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ["superadmin", "admin", "user"],
    default: "user",
    message: '{VALUE} is not a valid role',
    index: true
  },
  groups: [{ type: String, ref: "Group" }],
});

userSchema.pre<IUser>("save", async function (next) {
  if (this.isNew) {
    const UserModel = this.constructor as Model<IUser>;

    if (this.role === "superadmin") {
      const existingSuperAdmin = await UserModel.findOne({ role: "superadmin" });
      if (existingSuperAdmin) {
        return next(new Error('Superadmin already exists.'));
      }
    }
    if (this.role === "admin") {
      return next(new Error('Admin creation is not allowed.'));
    }
  }
  next();
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export const User = model<IUser>('User', userSchema);
