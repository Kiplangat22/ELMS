import {Express} from "express";
import * as notificationController from "../controllers/notifications.controller";

const notificationRouter = (app:Express) => {
  const notificationRouter = (app: Express) => {
    app.get('/notifications/:notification_id', notificationController.getNotificationById);
    app.get('/notifications', notificationController.getAllNotifications);
    app.post('/notifications', notificationController.createNotification);
    app.put('/notifications/:notification_id', notificationController.updateNotification);
    app.delete('/notifications/:notification_id', notificationController.deleteNotification);
    };

}

export default notificationRouter;