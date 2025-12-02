import {Express} from "express";
import * as leaveBalanceController from '../controllers/leave_balance.controllers'

const notificationRouter = (app:Express) => {
    
    app.get('/notifications/:id', notificationController.getCarById);
    app.post('/notifications', notificationController.createCar);
    app.put('/notifications/:id', notificationController.updateCar);
    app.delete('/notifications/:id', notificationController.deleteCar);

    app.get('/allcars', notificationController.getAllCarsController);
}

export default notificationController;