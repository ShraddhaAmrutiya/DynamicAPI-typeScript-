import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/UserSchema";
import dotenv from "dotenv";
dotenv.config();
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
import bcrypt from "bcryptjs";
import{RegisterRequestBody,LoginRequestBody,RefreshRequestBody,AuthenticatedRequest,UpdateRequestBody} from '../types'

const registerUser = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
) => {
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
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
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
  } catch (error) {
    res
      .status(500)
      .send({ message: "Server error", error: (error as Error).message });
  }
};

const loginUser = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Fill the required fields." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
      return res
        .status(500)
        .json({
          message: "JWT secrets are not defined in the environment variables.",
        });
    }

    const accessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .json({
        message: "User logged in successfully.",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

const refresh = (req: Request<{}, {}, RefreshRequestBody>, res: Response) => {
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

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    if (decoded && typeof decoded !== "string" && "id" in decoded) {
      const accessToken = jwt.sign({ id: decoded.id }, ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });
      return res.status(200).json({ accessToken });
    } else {
      return res.status(403).json({ message: "Invalid refresh token payload" });
    }
  });
};

const readedUser = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find().select("_id username").skip(skip).limit(limit),
      User.countDocuments(),
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
  } catch (error) {
    res
      .status(500)
      .send({ message: "Server error", error: (error as Error).message });
  }
};



const updateUser = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { role, ...updateData } = req.body as UpdateRequestBody
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
  
      const userToUpdate = await User.findById(id);
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
  
      const updatedUser = await User.findByIdAndUpdate(id, { ...updateData, role }, {
        new: true,
      });
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({
        message: "User updated successfully",
        updatedUser: updatedUser.username,
      });
    } catch (error) {
      res.status(500).send({ message: "Server error", error: (error as Error).message });
    }
  };
  



const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User deleted!", deletedUser: deletedUser.username });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Server error", error: (error as Error).message });
  }
};

export { registerUser, loginUser, refresh, readedUser, updateUser, deleteUser };
