import { Request, Response } from 'express';
import * as leaveTypeServices from '../services/leave_types.services';


export const getLeaveTypes = async (req: Request, res: Response) => {
    try {
        const leaveTypes = await leaveTypeServices.listLeaveTypes();
        res.status(200).json(leaveTypes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getLeaveTypeById = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id); // FIXED
    try {
        const leaveType = await leaveTypeServices.getLeaveType(id);
        if (leaveType) {
            res.status(200).json(leaveType);
        }
    } catch (error: any) {
        if (error.message === 'Invalid leave type id') {
            res.status(400).json({ message: 'Invalid leave type id' });
        } else if (error.message === 'Leave type not found') {
            res.status(404).json({ message: 'Leave type not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};


export const createLeaveType = async (req: Request, res: Response) => {
    const leaveType = req.body;
    try {
        const result = await leaveTypeServices.createLeaveType(leaveType);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateLeaveType = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.leave_type_id);
    const leaveType = req.body;
    try {
        const result = await leaveTypeServices.updateLeaveType(id, leaveType);
        if (result) {
            res.status(200).json(result);
        }
    } catch (error: any) {
        if (error.message === 'Invalid leave type id') {
            res.status(400).json({ message: 'Invalid leave type id' });
        } else if (error.message === 'Leave type not found') {
            res.status(404).json({ message: 'Leave type not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export const deleteLeaveType = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.leave_type_id);
    try {
        const result = await leaveTypeServices.deleteLeaveType(id);
        res.status(204).json(result);
    } catch (error: any) {
        if (error.message === 'Leave type not found') {
            return res.status(404).json({ message: 'Leave type not found' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};