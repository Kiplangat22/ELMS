// src/index.ts
import express from 'express';
import cors from 'cors';

// Routers
import authRouter from '../src/routers/auth.routes';
import leaveRouter from '../src/routers/leave_request.routes';
import employeeRouter from '../src/routers/employees.routes';

const initializeApp = () => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    }));

    app.get('/', (req, res) => {
        res.json({
            message: 'ELMS API is running',
            version: '1.0.0',
            timestamp: new Date().toISOString()
        });
    });

    // Attach routes
    app.use('/api/auth', authRouter);
    app.use('/api/leave-requests', leaveRouter);
    app.use('/api/employees', employeeRouter);

    return app;
};

export default initializeApp();
