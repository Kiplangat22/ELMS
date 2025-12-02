import * as notificationService from "../services/notifications.services";
import * as leaveRequestRepository from "../repositories/leave_request.repositories";
import * as leaveBalanceRepository from "../repositories/leave_balance.repositories";
import { Leave_Request, New_leave_Request } from "../types/leave_request.type";
import { Leave_Balance } from "../types/leavebalance.types";


//Calculate business days between two dates

export const calculateBusinessDays = async (start_date: Date, end_date: Date): Promise<number> => {
  let count = 0;
  const curDate = new Date(start_date);
  const end = new Date(end_date);

  while (curDate <= end) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    curDate.setDate(curDate.getDate() + 1);
  }

  return count;
};


//Create a new leave request

export const createLeaveRequest = async (employee_id: number, leaveReq: New_leave_Request) => {

    // Validate dates
    const startDate = new Date(leaveReq.start_date);
    const endDate = new Date(leaveReq.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) 
        throw new Error("Start date cannot be in the past");
    if (endDate < startDate) throw new Error("End date must be after start date");

 // Calculate total business days
    const totalDays = await calculateBusinessDays(startDate, endDate);

    if (totalDays <= 0){
        throw new Error("Leave must span at least one business day");
    }

// Check overlapping requests
    const overlapping = await leaveRequestRepository.checkOverlap(
        employee_id, 
        startDate, 
        endDate);

    if (overlapping.length > 0) {
        throw new Error("You already have a leave request for this period");
    }

 // check leave balance
    let balance= await leaveBalanceRepository.getAllLeaveBalances(employee_id); //8
//if no balance create one with deflt 20 dyas 
    // if (!balance) {
    //     balance = await leaveBalanceRepository.create(employee_id,20.0);

    // }

    console.log("balance days", balance)

    if (balance.balance_days < totalDays) {
      throw new Error(`Insufficient leave balance. Available: ${balance.balance_days} days, Requested: ${totalDays} days`);
    }
    // Create the leave request
    const leaveRequest:New_leave_Request={
      employee_id:employee_id,
      leave_type_id: leaveReq.leave_type_id,
      start_date: startDate,
      end_date: endDate,
      total_days: totalDays,
      justification: leaveReq.justification,
      requested_at:leaveReq.requested_at   
     };
    
const createLeaveRequest = await leaveRequestRepository.createLeaveReq(leaveRequest);
    }


// TODO: Send submission notification
//  await notificationService.sendSubmissionNotification(   
//      employee_id, 
//      createLeaveRequest.request_id,
//      createLeaveRequest);

//     return leaveRequest;
//   };

 //Approve leave request

export const approveLeaveRequest = async (request_id: number, approver_id: number) => {
  try {
    const leaveRequest = await leaveRequestRepository.findLeaveReqById(request_id);
    if (!leaveRequest) throw new Error("Leave request not found");
    if (leaveRequest.status !== "Pending")
         throw new Error(`Cannot approve a request that is already ${leaveRequest.status}`);

    // Deduct balance
    await leaveBalanceRepository.deductBalance(leaveRequest.employee_id, leaveRequest.total_days);

    // Update status
    const updatedRequest = await leaveRequestRepository.updateLeaveReqStatus(request_id, "Approved");

    // Notify
    await notificationService.sendApprovalNotification(leaveRequest.employee_id, request_id, leaveRequest);

    return updatedRequest;
  } catch (error) {
    throw error;
  }
};

// Reject leave request

export const rejectLeaveRequest = async (request_id: number, rejecter_id: number) => {
  try {
    const leaveRequest = await leaveRequestRepository.findLeaveReqById(request_id);
    if (!leaveRequest) throw new Error("Leave request not found");
    if (leaveRequest.status !== "Pending") throw new Error(`Cannot reject a request that is already ${leaveRequest.status}`);

    const updatedRequest = await leaveRequestRepository.updateLeaveReqStatus(request_id, "Rejected");

    // Send rejection notification
      await notificationService.sendRejectionNotification(leaveRequest.employee_id, request_id, leaveRequest);

    return updatedRequest;
  } catch (error) {
    throw error;
  }
};

// Cancel leave request (by employee)

export const cancelLeaveRequest = async (request_id: number, employee_id: number) => {
  try {
    const leaveRequest = await leaveRequestRepository.findLeaveReqById(request_id);
    if (!leaveRequest) throw new Error("Leave request not found");
    if (leaveRequest.employee_id !== employee_id) throw new Error("You can only cancel your own leave requests");
    if (leaveRequest.status !== "Pending") throw new Error("Only pending requests can be cancelled");

    await leaveRequestRepository.deleteLeaveReq(request_id);

    return { message: "Leave request cancelled successfully" };
  } catch (error) {
    throw error;
  }
};

// Get employee leave requests
export const getEmployeeLeaveRequests = async (employee_id: number) => {
    const requests= await
    leaveRequestRepository.findLeaveReqByEmployeeId(employee_id);
    return requests||[];
  } ;

//Get all pending leave requests (admin)
 
export const getPendingLeaveRequests = async () => {
  try {
    return await leaveRequestRepository.findleaveReqPending();
  } catch (error) {
    throw error;
  }
};

// Get all leave requests (admin)

export const getAllLeaveRequests = async () => {
  try {
    return await leaveRequestRepository.findAllLeaveReq();
  } catch (error) {
    throw error;
  }
};

// Get specific leave request details
 
export const getLeaveRequestById = async (request_id: number) => {
  try {
    return await leaveRequestRepository.findLeaveReqById(request_id);
  } catch (error) {
    throw error;
  }
};

// Get or create employee leave balance

export const getEmployeeBalance = async (employee_id: number) => {
  try {
    let balance = await
     leaveBalanceRepository.getAllLeaveBalances(employee_id);
    if (!balance) {
        balance = await leaveBalanceRepository.create(employee_id, 20.0);
    }
    return balance;
  } catch (error) {
    throw error;
  }
};
