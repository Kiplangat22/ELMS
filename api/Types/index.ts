// src/index.ts
import express from 'express';
import cors from 'cors';
// import { logger } from './middleware/logger';
// import { rateLimiterMiddleware } from './middleware/rateLimiter';
// import { errorHandler } from './middleware/errorHandler';

// // Import routers
// import authRouter from './routes/auth/auth.router';
// import leaveRouter from './routes/leave/leave.router';
// import employeeRouter from './routes/employee/employee.router';
// import adminRouter from './routes/admin/admin.router';

const initializeApp = () => {
    const app = express();

    // Middleware
    app.use(express.json()); // Parse JSON bodies
    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    
    app.use(cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    }));

    // app.use(logger);
    // app.use(rateLimiterMiddleware);

    // Health check route
    app.get('/', (req, res) => {
        res.json({ 
            message: 'ELMS API is running',
            version: '1.0.0',
            timestamp: new Date().toISOString()
        });
    });

    // // API Routes
    // authRouter(app);
    // leaveRouter(app);
    // employeeRouter(app);
    // adminRouter(app);

    // // Error handling middleware (must be last)
    // app.use(errorHandler);

    return app;
};

const app = initializeApp();

export default app;