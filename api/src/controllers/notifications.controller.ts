import { Request, Response } from 'express';
import * as notificationServices from '../services/notifications.services';

// ✔ Get all notifications (Admin)
export const getAllNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await notificationServices.getAllNotification();
        res.status(200).json(notifications);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// ✔ Get notifications for employee
export const getNotificationByEmployeeId = async (req: Request, res: Response) => {
    const employee_id = parseInt(req.params.employee_id);
    try {
        const notifications = await notificationServices.getEmployeeNotifications(employee_id);
        if (notifications.length > 0) {
            res.status(200).json(notifications);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// ✔ Get single notification (Admin)
export const getNotificationById = async (req: Request, res: Response) => {
    const notification_id = parseInt(req.params.notification_id);
    try {
        const notification = await notificationServices.getNotificationById(notification_id);
        res.status(200).json(notification);
    } catch (error: any) {
        if (error.message === 'Notification not found') {
            res.status(404).json({ message: 'Notification not found' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

// ✔ Create notification
export const createNotification = async (req: Request, res: Response) => {
    const { employee_id, request_id, message } = req.body;
    try {
        const notification = await notificationServices.addNotification({ employee_id, request_id, message });
        res.status(201).json(notification);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// ✔ Update notification (Admin)
export const updateNotification = async (req: Request, res: Response) => {
    const notification_id = parseInt(req.params.notification_id);
    const updates = req.body;
    try {
        const updated = await notificationServices.modifyNotification(notification_id, updates);
        res.status(200).json(updated);
    } catch (error: any) {
        if (error.message === 'Notification not found') {
            res.status(404).json({ message: 'Notification not found' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

// ✔ Delete notification (Admin)
export const deleteNotification = async (req: Request, res: Response) => {
    const notification_id = parseInt(req.params.notification_id);
    try {
        const result = await notificationServices.deleteNotification(notification_id);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Notification not found') {
            res.status(404).json({ message: 'Notification not found' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
