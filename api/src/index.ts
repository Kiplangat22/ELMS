import express from 'express'
import dotenv from 'dotenv';
import { getPool } from './db/config';

//import route later   
//import employeesRoutes from './routers/employees.routes';   
import departmentRoutes from './routers/department.routes';
import leaveBalanceRoutes from './routers/leave_balance.routes';
import LeaveTypeRoutes from './routers/leave_types.routes';
import LeaveRequestRoutes from './routers/leave_request.routes';

dotenv.config();

const initializeApp = () => {
    const app = express();
    
    app.use(express.json());

    // Register routes
    //app.use('/api/employees', employeesRoutes);
    app.use('/api/departments', departmentRoutes);
    app.use('/api/leave-types', LeaveTypeRoutes);
    app.use('/api/leave-balances', leaveBalanceRoutes);
    app.use('/api/leave-requests', LeaveRequestRoutes);
    
    app.get('/', (_, res) => {
        res.send("Welcome to the Employee Leave Management System API");
    });
    
    return app;
}

const app = initializeApp();
export default app;
