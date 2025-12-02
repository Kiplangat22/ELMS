import * as notificationRepository from '../repositories/notifications.repositories'
import { NewNotification, UpdateNotification } from '../types/notification.types'

// export const getAllNotifications = async() => await notificationRepository.getAllNotifications();
// export const getNotification =async(id: number) => await notificationRepository.getNotificationById(id);
export const addNotification = async (notification: {employee_id:number,request_id:number, message:string}) => await notificationRepository.createNotification(notification.employee_id, notification.request_id, notification.message);

export const modifyNotification = async (id: number, notificationUpdates:UpdateNotification) => {
    const existingNotification = await notificationRepository.getNotificationById(id);
    if(!existingNotification){
        throw new Error('Notification not found');
    }
    return await notificationRepository.updateNotification(id, notificationUpdates);
 };

// export const removeNotification= async (id: number) => {
//     const existingNotification = await notificationRepository.getNotificationById(id);
//     if(!existingNotification){
//         throw new Error('Notification not found');
//     }
//     return await notificationRepository.deleteNotification(id);
// }


/////////
import * as notificationRepo from '../repositories/notifications.repositories';
import { Leave_Request,New_leave_Request,Update_leave_Request  } from '../types/leave_request.type';

// Get notifications for employee
export const getEmployeeNotifications = async (employee_id: number) => {
    return await notificationRepo.getNotificationById(employee_id);
};

// Get all notifications (admin)
export const getAllNotification = async () => {
    return await notificationRepo.getAllNotifications();
};


// Send notification when leave is approved
export const sendApprovalNotification = async (
    employee_id: number,
    request_id: number,
    leaveDetails: Leave_Request
) => {
    const startDateStr = new Date(leaveDetails.start_date).toLocaleDateString();
    const endDateStr = new Date(leaveDetails.end_date).toLocaleDateString();
    
    const message = `Your leave request from ${startDateStr} to ${endDateStr} has been APPROVED. Total days: ${leaveDetails.total_days}`;
    
    
    return await notificationRepo.createNotification(employee_id, request_id, message);// why????? to check
};

// Send notification when leave is rejected 
export const sendRejectionNotification = async (
    employee_id: number,
    request_id: number,
    leaveDetails: Leave_Request
) => {


    const startDateStr = new Date(leaveDetails.start_date).toLocaleDateString();
    const endDateStr = new Date(leaveDetails.end_date).toLocaleDateString();
    
    const message = `Your leave request from ${startDateStr} to ${endDateStr} has been REJECTED.`;
    
    return await notificationRepo.createNotification(employee_id, request_id, message);
    

    return null;
};

// Send notification when leave is submitted
export const sendSubmissionNotification = async (
    employee_id: number,
    request_id: number,
    leaveDetails: Leave_Request
) => {
    const startDateStr = new Date(leaveDetails.start_date).toLocaleDateString();
    const endDateStr = new Date(leaveDetails.end_date).toLocaleDateString();
    
    const message = `Your leave request from ${startDateStr} to ${endDateStr} has been submitted and is pending approval.`;
    
    return await notificationRepo.createNotification(employee_id, request_id, message);
};



// Delete notification
export const deleteNotification = async (notification_id: number) => {
    return await notificationRepo.deleteNotification(notification_id);
};