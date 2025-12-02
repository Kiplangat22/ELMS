import {Request, Response} from 'express';
import * as leaveBalnceServices from '../services/leave_balance.services';
import { error } from 'console';
//list all leave balances 
export const getAllLeaveBalances = async (req: Request, res: Response) => {
    try{
        const leaveBalance = await leaveBalnceServices.getAllBalances();
        console.log(leaveBalance);
    
        res.status(200).json(leaveBalance);
    } catch (error: any){
        res.status(500).json({error:error.message});
    }
};

//get leave balance for one employee
export const getLeaveBalanceById = async(req: Request, res: Response) => {
    try{
        const { employee_id } = req.params;
        const leaveBalance =await leaveBalnceServices.getEmployeeLeaveBalances(Number(employee_id));
        if (leaveBalance){
            res.status(200).json(leaveBalance);
        }else{
            res.status(400).json({message:'Leave Balance not Found'});
        
        }
    }catch(error:any){
        res.status(500).json({error:error.message});
        console.log("Error fetching the leave balance ",error);
    }
};
//creting initial bal
export const createLeaveBalance = async(req: Request, res: Response) =>{

    try{
        const { employee_id,balance_days} = req.body;
        const createdLeaveBalance = await leaveBalnceServices.createInitialBalance(Number(employee_id),balance_days);
        res.status(201).json(createdLeaveBalance);
    } catch (error:any){
        res.status(500).json({error: error.message});
        console.log(error)
    }
};
// Add back leave days on rejection
export const addLeaveDays = async (req: Request, res: Response) => {
  try {
    const { employee_id, balance_days } = req.body;
    const updated = await leaveBalnceServices.addLeaveDays(Number(employee_id), balance_days);
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
//update leave bal 
export const updateLeaveBalance = async (req: Request, res: Response) => {
  try {
    const { employee_id, balance_days } = req.body;
    const updated = await leaveBalnceServices.updateLeaveBalance(Number(employee_id), balance_days);
    res.status(200).json(updated);
    console.log(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
//delete leave bal
export const deleteLeaveBalance = async(req: Request, res: Response) => {
    const leaveBalanceId = parseInt(req.params.balance_id);
    if(isNaN(leaveBalanceId)){
        return res.status(400).json({message: 'Invalid Leave Balance'});
    }

    try{
        const result = await leaveBalnceServices.deleteLeaveBalance(leaveBalanceId);
        res.status(200).json(result);
    } catch(error:any){
        if (error.message === 'Leave Balance not Found'){
            res.status(404).json({message:'Leave Balance not found'});
        }else{ 
            res.status(500).json({error:error.message});
        }
    }
};
