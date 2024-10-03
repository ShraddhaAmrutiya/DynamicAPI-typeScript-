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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema_1 = require("./models/UserSchema");
dotenv.config();
const { MONGO_URI } = process.env;
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});
const [username, password] = process.argv.slice(2);
if (!username || !password) {
    console.error('Please provide both username and password as arguments.');
    process.exit(1);
}
const createSuperAdmin = async () => {
    try {
        const existingSuperAdmin = await UserSchema_1.User.findOne({ role: 'superadmin' });
        if (existingSuperAdmin) {
            console.log('Superadmin already exists.');
            process.exit(0);
        }
        const superAdmin = new UserSchema_1.User({ username, password, role: 'superadmin' });
        await superAdmin.save();
        console.log('Superadmin user created successfully.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating superadmin:', error);
        process.exit(1);
    }
};
createSuperAdmin();
