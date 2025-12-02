import { Request, Response } from 'express';
import * as leaveRequestService from '../services/leave_request.services';
import * as notificationService from '../services/notifications.services';

// Create new leave request
export const createLeaveRequest = async (req: Request, res: Response) => {
    try {
        const employeeId = req.Employee?.employee_id; // From auth middleware
        const LeaveReq = req.body;

        if (!employeeId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized ,Employee ID not found'
            });
        }

        const leaveRequest = await leaveRequestService.createLeaveRequest(employeeId, LeaveReq);

        res.status(201).json({
            success: true,
            message: 'Leave request submitted successfully',
            data: leaveRequest
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create leave request'
        });
    }
};

// Get employee's own leave requests
export const getMyLeaveRequests = async (req: Request, res: Response) => {
    try {
        const employeeId = req.Employee?.employee_id;

        if (!employeeId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const requests = await leaveRequestService.getEmployeeLeaveRequests(employeeId);

        res.status(200).json({
            success: true,
            count: requests?.length || 0,
            data: requests || []  
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch leave requests'
        });
    }
};

// Get all pending leave requests (Manager/Admin)
export const getPendingRequests = async (req: Request, res: Response) => {
    try {
        const requests = await leaveRequestService.getPendingLeaveRequests();

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch pending requests'
        });
    }
};

// Get all leave requests (Admin only)
export const getAllRequests = async (req: Request, res: Response) => {
    try {
        const requests = await leaveRequestService.getAllLeaveRequests();

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch all requests'
        });
    }
};

// Get specific leave request by ID
export const getLeaveRequestById = async (req: Request, res: Response) => {
    try {
        const { request_id } = req.params;
        const requestId = parseInt(request_id);

        if (isNaN(requestId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request ID'
            });
        }

        const request = await leaveRequestService.getLeaveRequestById(requestId);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch leave request'
        });
    }
};

// Approve leave request (Manager/Admin)
export const approveLeaveRequest = async (req: Request, res: Response) => {
    try {
        const { request_id } = req.params;
        const requestId = parseInt(request_id);
        const approverId = req.Employee?.employee_id;

        if (isNaN(requestId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request ID'
            });
        }

        if (!approverId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const updatedRequest = await leaveRequestService.approveLeaveRequest(requestId, approverId);

        res.status(200).json({
            success: true,
            message: 'Leave request approved successfully',
            data: updatedRequest
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to approve leave request'
        });
    }
};

// Reject leave request (Manager/Admin)
export const rejectLeaveRequest = async (req: Request, res: Response) => {
    try {
        const { request_id} = req.params;
        const requestId = parseInt(request_id);
        const rejecterId = req.Employee?.employee_id;

        if (isNaN(requestId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request ID'
            });
        }

        if (!rejecterId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const updatedRequest = await leaveRequestService.rejectLeaveRequest(requestId, rejecterId);

        res.status(200).json({
            success: true,
            message: 'Leave request rejected',
            data: updatedRequest
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to reject leave request'
        });
    }
};

// Cancel leave request (Employee)
export const cancelLeaveRequest = async (req: Request, res: Response) => {
    try {
        const { request_id } = req.params;
        const requestId = parseInt(request_id);
        const employeeId = req.Employee?.employee_id;

        if (isNaN(requestId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request ID'
            });
        }

        if (!employeeId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const result = await leaveRequestService.cancelLeaveRequest(requestId, employeeId);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to cancel leave request'
        });
    }
};

// Get employee's leave balance
export const getMyBalance = async (req: Request, res: Response) => {
    try {
        const employeeId = req.Employee?.employee_id;

        if (!employeeId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const balance = await leaveRequestService.getEmployeeBalance(employeeId);

        res.status(200).json({
            success: true,
            data: balance
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch leave balance'
        });
    }
};


// Get employee's notifications
export const getMyNotifications = async (req: Request, res: Response) => {
    try {
        const employeeId = req.Employee?.employee_id;

        if (!employeeId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const notifications = await notificationService.getEmployeeNotifications(employeeId);

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch notifications'
        });
    }
};

// Get all notifications (Admin)
export const getAllNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await notificationService.getAllNotification();

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch all notifications'
        });
    }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const {  notification_id } = req.params;
        const notificationId = parseInt(notification_id);

        if (isNaN(notificationId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid notification ID'
            });
        }

        const result = await notificationService.deleteNotification(notificationId);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to delete notification'
        });
    }
};
