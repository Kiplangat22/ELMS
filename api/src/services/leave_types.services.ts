import * as leaveTypeRepository from '../repositories/leave_types.repositories';
import { NewLeaveType, UpdateLeaveType,LeaveType } from '../types/leave_types.types';

export const listLeaveTypes = async () => {
    return await leaveTypeRepository.getAllLeaveTypes();
};

export const getLeaveType = async (leave_type_id: number) => {
    const leaveType = await leaveTypeRepository.getLeaveTypeById(leave_type_id);
    if (!leaveType) {
        throw new Error('Leave type not found');
    }
    return leaveType;
};

export const createLeaveType = async (leaveType: NewLeaveType) => {
    return await leaveTypeRepository.createLeaveType(leaveType);
};

export const updateLeaveType = async (leave_type_id: number, leaveType: UpdateLeaveType) => {
    const existingLeaveType = await leaveTypeRepository.getLeaveTypeById(leave_type_id);
    if (!existingLeaveType) {
        throw new Error('Leave type not found');
    }
    return await leaveTypeRepository.updateLeaveType(leave_type_id, leaveType);
};

export const deleteLeaveType = async (leave_type_id: number) => {
    const existingLeaveType = await leaveTypeRepository.getLeaveTypeById(leave_type_id);
    if (!existingLeaveType) {
        throw new Error('Leave type not found');
    }
    return await leaveTypeRepository.deleteLeaveType(leave_type_id);
};