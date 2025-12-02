import * as LeaveBalanceRepository from '../repositories/leave_balance.repositories';
import { Leave_Balance, NewLeave_Balance, UpdateLeave_Balance } from '../types/leavebalance.types';


export const getEmployeeLeaveBalances = async (employee_id: number): Promise<Leave_Balance | null> => {
  try {
    return await LeaveBalanceRepository.getAllLeaveBalances(employee_id);
  } catch (error: any) {
    throw new Error(`Failed to get leave balances: ${error.message || error}`);
  }
};

export const createInitialBalance = async (employee_id: number, balance_days: number ): Promise<Leave_Balance> => {
  try {
    return await LeaveBalanceRepository.create(employee_id, balance_days);
  } catch (error) {
    throw new Error(`Failed to create leave balance: ${error}`);
  }
};

export const deductLeaveDays = async (employee_id: number, days: number): Promise<Leave_Balance> => {
  try {
    return await LeaveBalanceRepository.deductBalance(employee_id, days);
  } catch (error) {
    throw new Error(`Failed to deduct leave days: ${error}`);
  }
};

export const addLeaveDays = async (employee_id: number, days: number): Promise<Leave_Balance> => {
  try {
    return await LeaveBalanceRepository.addBalance(employee_id, days);
  } catch (error) {
    throw new Error(`Failed to add leave days: ${error}`);
  }
};

export const updateLeaveBalance = async (employee_id: number, balance_days: number): Promise<Leave_Balance> => {
  try {
    return await LeaveBalanceRepository.updateBalance(employee_id, balance_days);
  } catch (error) {
    throw new Error(`Failed to update leave balance: ${error}`);
  }
};

export const getAllBalances = async (): Promise<Leave_Balance[]> => {
  try {
    return await LeaveBalanceRepository.findAll();
  } catch (error) {
    throw new Error(`Failed to fetch all leave balances: ${error}`);
  }
};

export const deleteLeaveBalance = async (balance_id: number) => {
  try {
    return await LeaveBalanceRepository.deleteLeaveBalance(balance_id);
  } catch (error) {
    throw new Error(`Failed to delete leave balance: ${error}`);
  }
};
