import { Request, Response } from 'express';
import * as employeeService from '../services/employees.services';
import bcrypt from 'bcrypt';

// REGISTER
export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, department, role } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification code (commented out)
        // const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const employeeData = {
            first_name: firstName,
            last_name: lastName,
            email,
            hashed_pass: hashedPassword,
            role: role || 'user',
            department_id: department ? parseInt(department) : 1, // default to 1 if null
            date_joined: new Date(),
            employee_id: 0, // will be ignored
            // verification_code: verificationCode,
            is_verified: 1 // Since verification commented out
        };

        const result = await employeeService.createEmployee(employeeData);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const result = await employeeService.loginEmployee(email, password);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Employee not found') {
            res.status(404).json({ error: error.message });
        } else if (error.message === 'Invalid credentials') {
            res.status(401).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

// VERIFY
export const verify = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: 'Email and verification code are required' });
        }

        const result = await employeeService.verifyEmployee(email, code);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};