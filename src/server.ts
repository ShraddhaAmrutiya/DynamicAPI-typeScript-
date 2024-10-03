import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import authRoutes from './routers/authRoutes';
import moduleRoutes from './routers/moduleRoutes';
import permissionRoutes from './routers/permissionRoutes';
import groupRoutes from './routers/groupRoutes';
import groupPermissionRoutes from './routers/groupPermissionRout';
import userRoutes from './routers/userARoutes';
import {User} from './models/UserSchema';
import ModulePermissionRout from './routers/modulePermission';

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan('combined'));

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error(error));

const checkSuperadmin = async () => {
  try {
    const superadmin = await User.findOne({ role: 'superadmin' });
    if (!superadmin) {
      console.error('No superadmin user found. Exiting...');
      process.exit(1);
    }

    app.use('/auth', authRoutes);
    app.use('/modules', moduleRoutes);
    app.use('/permissions', permissionRoutes);
    app.use('/', ModulePermissionRout);
    app.use('/groups', groupRoutes);
    app.use('/users', userRoutes);
    app.use('/groups', groupPermissionRoutes);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Something went wrong!' });
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Error checking superadmin:', error);
    process.exit(1);
  }
};

checkSuperadmin();

