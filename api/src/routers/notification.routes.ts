import {Express} from "express";
import * as notificationController from "../controllers/notifications.controller";

const notificationRouter = (app:Express) => {
    
    app.get('/notifications/:id', notificationController.getNotificationById);
    app.post('/notifications', notificationController.createNotification);
    app.put('/notifications/:id', notificationController.updateNotification);
    app.delete('/notifications/:id', notificationController.deleteNotification);
}

export default notificationRouter;