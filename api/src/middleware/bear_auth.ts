import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            Employee?: {
                employee_id: number;
                email: string;
                role: string;
                first_name: string;
                last_name: string;
            };
        }
    }
}

// Authenticate JWT token
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Invalid token format.'
            });
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, jwtSecret) as {
            employee_id: number;
            email: string;
            role: string;
            first_name: string;
            last_name: string;
        };

        req.Employee = decoded;
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please login again.'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

// Authorize based on roles
export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.Employee) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - User not authenticated'
            });
        }

        if (!roles.includes(req.Employee.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden. Required role: ${roles.join(' or ')}. Your role: ${req.Employee.role}`
            });
        }

        next();
    };
};
