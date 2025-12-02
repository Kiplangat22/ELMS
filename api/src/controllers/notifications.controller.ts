import {Request, Response} from 'express';
import {getPool} from '../db/config'
import * as notificationServices from '../services/notifications.services'

export const getAllNotifications = async(req: Request, res: Response) => {
    try{
        const notifications = await notificationServices.getAllNotification();
        res.status(200).json(notifications);
    }catch(error:any){
        res.status(500).json({error:error.message});
    }
};

export const getNotificationById =async( req:Request, res: Response) => {
    const notificationId =parseInt(req.params.notificationId);
    try{
        const notification = await notificationServices.getEmployeeNotifications(notificationId);
        if (notification){
            res.status(200).json(notification);
        } else {
            res.status(404).json({message: 'Notification not found'});
        }
    }catch (error: any){
        res.status(500).json({error:error.message});
    }
};

export const createNotification = async (req: Request, res: Response) => {
    const newNotification = req.body;
    try{
        const createdNotification = await notificationServices.addNotification(newNotification);
        res.status(201).json(createNotification);
    }catch (error: any){
        res.status(500).json({error:error.message})
    }
};

export const updateNotification = async (req: Request, res: Response) => {
    const notificationId = parseInt(req.params.id);
    const notificationUpdates = req.body;

    if(isNaN(notificationId)){
        return res.status(400).json({message: 'Invalid Notification ID'});
    }

    try{
        const updatedNotification = await notificationServices.modifyNotification(notificationId, notificationUpdates);
        res.status(200).json(updatedNotification);
    }catch(error:any){
        if (error.message === 'Notification not found'){
            res.status(404).json({message:'Notification not Found'});
        }else{
            res.status(500).json({error:error.message})
        }
    }
};

export const deleteNotification = async(req: Request, res: Response) => {
    const notificationId = parseInt(req.params.notification_id);
    if(isNaN(notificationId)){
        return res.status(400).json({message: 'Invalid Notification'});
    }

    try{
        const result = await notificationServices.deleteNotification(notificationId);
        res.status(200).json(result);
    } catch(error:any){
        if (error.message === 'Notification not Found'){
            res.status(404).json({message:'Notification not found'});
        }else{ 
            res.status(500).json({error:error.message});
        }
    }
}