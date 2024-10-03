import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/UserSchema'; 
interface AuthenticatedRequest extends Request {
    user?: {
      id: string;
      role: string;
    };
  }
  
  const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: string };
      const user = await User.findById(decoded.id).select('-password'); 
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      req.user = { id: user._id.toString(), role: user.role }; 
      next();
    } catch (error) {
      res.status(403).json({ message: "Invalid token" });
    }
  };
  
  export default authMiddleware;