"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routers/authRoutes"));
const moduleRoutes_1 = __importDefault(require("./routers/moduleRoutes"));
const permissionRoutes_1 = __importDefault(require("./routers/permissionRoutes"));
const groupRoutes_1 = __importDefault(require("./routers/groupRoutes"));
const groupPermissionRout_1 = __importDefault(require("./routers/groupPermissionRout"));
const userARoutes_1 = __importDefault(require("./routers/userARoutes"));
const UserSchema_1 = require("./models/UserSchema");
const modulePermission_1 = __importDefault(require("./routers/modulePermission"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)('combined'));
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error(error));
const checkSuperadmin = async () => {
    try {
        const superadmin = await UserSchema_1.User.findOne({ role: 'superadmin' });
        if (!superadmin) {
            console.error('No superadmin user found. Exiting...');
            process.exit(1);
        }
        app.use('/auth', authRoutes_1.default);
        app.use('/modules', moduleRoutes_1.default);
        app.use('/permissions', permissionRoutes_1.default);
        app.use('/', modulePermission_1.default);
        app.use('/groups', groupRoutes_1.default);
        app.use('/users', userARoutes_1.default);
        app.use('/groups', groupPermissionRout_1.default);
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Something went wrong!' });
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
    catch (error) {
        console.error('Error checking superadmin:', error);
        process.exit(1);
    }
};
checkSuperadmin();
