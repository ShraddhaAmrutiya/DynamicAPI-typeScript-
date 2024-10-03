"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const bcrypt = __importStar(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    _id: { type: String, default: uuid_1.v4 },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        match: [/^[a-zA-Z0-9._-]{3,50}$/, 'Please enter a valid user name.'],
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
userSchema.pre("save", async function (next) {
    if (this.isNew) {
        const UserModel = this.constructor;
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
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
exports.User = (0, mongoose_1.model)('User', userSchema);
