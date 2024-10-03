import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './models/UserSchema';

dotenv.config();

const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI as string)
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
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });

    if (existingSuperAdmin) {
      console.log('Superadmin already exists.');
      process.exit(0);
    }

    const superAdmin = new User({ username, password, role: 'superadmin' });
    await superAdmin.save();

    console.log('Superadmin user created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating superadmin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
