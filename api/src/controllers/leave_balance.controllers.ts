import { Request, Response } from 'express';
import * as leaveBalanceServices from '../services/leave_balance.services';

// GET all leave balances
export const getAllLeaveBalances = async (req: Request, res: Response) => {
  try {
    const balances = await leaveBalanceServices.getAllBalances();
    res.status(200).json(balances);
  } catch (error: any) {
    console.error("Error fetching leave balances:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET leave balance by employee ID
export const getLeaveBalanceById = async (req: Request, res: Response) => {
  try {
    const employee_id = Number(req.params.employee_id);
    const balance = await leaveBalanceServices.getEmployeeLeaveBalances(employee_id);
    if (!balance) {
      return res.status(404).json({ message: 'Leave balance not found' });
    }
    res.status(200).json(balance);
  } catch (error: any) {
    console.error("Error fetching leave balance:", error);
    res.status(500).json({ error: error.message });
  }
};

// CREATE initial leave balance
export const createLeaveBalance = async (req: Request, res: Response) => {
  try {
    const { employee_id, balance_days } = req.body;
    const created = await leaveBalanceServices.createInitialBalance(Number(employee_id), balance_days);
    res.status(201).json(created);
  } catch (error: any) {
    console.error("Error creating leave balance:", error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE leave balance by balance_id
export const updateLeaveBalance = async (req: Request, res: Response) => {
  try {
    const balance_id = Number(req.params.balance_id); 
    const { balance_days } = req.body;

    if (isNaN(balance_id)) {
      return res.status(400).json({ message: 'Invalid balance ID' });
    }

    const updated = await leaveBalanceServices.updateLeaveBalance(balance_id, balance_days);
    if (!updated) {
      return res.status(404).json({ message: 'Leave balance not found' });
    }

    res.status(200).json(updated);
  } catch (error: any) {
    console.error("Error updating leave balance:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE leave balance by balance_id
export const deleteLeaveBalance = async (req: Request, res: Response) => {
  try {
    const balance_id = Number(req.params.balance_id);
    if (isNaN(balance_id)) return res.status(400).json({ message: 'Invalid balance ID' });

    const deleted = await leaveBalanceServices.deleteLeaveBalance(balance_id);
    if (!deleted) return res.status(404).json({ message: 'Leave balance not found' });

    res.status(200).json({ message: 'Leave balance deleted successfully', deleted });
  } catch (error: any) {
    console.error("Error deleting leave balance:", error);
    res.status(500).json({ error: error.message });
  }
};
