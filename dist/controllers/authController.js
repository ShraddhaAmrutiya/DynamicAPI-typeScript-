"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.readedUser = exports.refresh = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema_1 = require("../models/UserSchema");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const registerUser = async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: "Fill the required fields." });
    }
    if (role && role !== "user") {
        return res
            .status(400)
            .json({ message: 'Invalid role. Only "user" role is allowed.' });
    }
    try {
        let user = await UserSchema_1.User.findOne({ username });
        if (user)
            return res.status(400).json({ message: "User already exists" });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new UserSchema_1.User({
            username,
            password: hashedPassword,
            role: role || "user",
        });
        await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            _id: newUser._id,
            username: newUser.username,
        });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "Server error", error: error.message });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Fill the required fields." });
    }
    try {
        const user = await UserSchema_1.User.findOne({ username });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(401).json({ message: "Invalid credentials" });
        if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
            return res
                .status(500)
                .json({
                message: "JWT secrets are not defined in the environment variables.",
            });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {
            expiresIn: "1h",
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
            expiresIn: "1d",
        });
        res
            .status(200)
            .json({
            message: "User logged in successfully.",
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
};
exports.loginUser = loginUser;
const refresh = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }
    if (!REFRESH_TOKEN_SECRET || !ACCESS_TOKEN_SECRET) {
        return res
            .status(500)
            .json({
            message: "JWT secrets are not defined in the environment variables.",
        });
    }
    jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        if (decoded && typeof decoded !== "string" && "id" in decoded) {
            const accessToken = jsonwebtoken_1.default.sign({ id: decoded.id }, ACCESS_TOKEN_SECRET, {
                expiresIn: "15m",
            });
            return res.status(200).json({ accessToken });
        }
        else {
            return res.status(403).json({ message: "Invalid refresh token payload" });
        }
    });
};
exports.refresh = refresh;
const readedUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [users, totalUsers] = await Promise.all([
            UserSchema_1.User.find().select("_id username").skip(skip).limit(limit),
            UserSchema_1.User.countDocuments(),
        ]);
        res.status(200).json({
            users,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalItems: totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
            },
        });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "Server error", error: error.message });
    }
};
exports.readedUser = readedUser;
const updateUser = async (req, res) => {
    const { role, ...updateData } = req.body;
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;
    const { id } = req.params;
    if (!currentUserId) {
        return res.status(401).json({ message: "Unauthorized: User not found." });
    }
    try {
        if (currentUserRole === "admin" && currentUserId === id) {
            return res.status(403).json({ message: "Admins cannot update their own information." });
        }
        if (currentUserRole === "superadmin" && currentUserId === id && role) {
            return res.status(403).json({ message: "Superadmins cannot change their own role." });
        }
        const userToUpdate = await UserSchema_1.User.findById(id);
        if (!userToUpdate) {
            return res.status(404).json({ message: "User not found" });
        }
        if (role === "superadmin") {
            return res.status(403).json({ message: "No user can be assigned the role of superadmin." });
        }
        if (currentUserRole === "admin" && userToUpdate.role === "superadmin") {
            return res.status(403).json({ message: "Admins cannot modify a superadmin." });
        }
        if (currentUserRole === "superadmin" && id === currentUserId.toString() && role) {
            return res.status(403).json({ message: "Superadmins cannot change their own role." });
        }
        const updatedUser = await UserSchema_1.User.findByIdAndUpdate(id, { ...updateData, role }, {
            new: true,
        });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "User updated successfully",
            updatedUser: updatedUser.username,
        });
    }
    catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await UserSchema_1.User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res
            .status(200)
            .json({ message: "User deleted!", deletedUser: deletedUser.username });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "Server error", error: error.message });
    }
};
exports.deleteUser = deleteUser;
