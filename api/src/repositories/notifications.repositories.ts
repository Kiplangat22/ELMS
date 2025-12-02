import {getPool} from "../db/config";
import { Notification, NewNotification, UpdateNotification } from "../types/notification.types";
//get all notifications for admin 
export const getAllNotifications = async (): Promise<Notification[]> => {
    const pool = await getPool();
    const result = await pool
    .request()
    .query('SELECT * FROM Notification');
    return result.recordset;
}
//get notification for an employeee by employee id 
export const getNotificationById = async (employee_id: number): Promise<Notification[]> => {
  const pool = await getPool();
  const result = await pool
        .request()
        .input('employee_id',employee_id)
        .query(`
            SELECT n.*, lr.status, lr.start_date, lr.end_date, lr.total_days
            FROM Notification n
            INNER JOIN Leave_Request lr ON n.request_id = lr.request_id
            WHERE n.employee_id = @employee_id
            ORDER BY n.created_at DESC
        `);
    
    return result.recordset;  
}
//cretate notification 
export const createNotification = async (employee_id:number,request_id:number, message:string) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('employee_id',employee_id)
        .input('request_id', request_id)
        .input('message', message)
        .query(`INSERT INTO Nofitication(employee_id, request_id, message)
            OUTPUT INSERTED.*
            VALUES (@)employee_id, @request_id, @message`);

            return{message: "Notification created successfully", notification: result.recordset[0]};
}
//updating notification 
export const updateNotification = async (notification_id: number, notificationUpdates:UpdateNotification)=> {
    const pool = await getPool();
    await pool.request()
        .input('id', notification_id)
        .query(`UPDATE Nofitication SET 
                employee_id = COALESCE(@employee_id, employee_id),
                request_id = COALESCE(@request_id, request_id),
                message = COALESCE(@message, message),
                WHERE notification_id= @id`);

        return{message: "Notification upddated successfully"};
}
//deleting notification
export const deleteNotification = async (notification_id:number) =>{
    const pool = await getPool();
    await pool.request()
        .input('id', notification_id)
        .query('DELETE FROM Notification WHERE notification_id =@notification_id');

    return{message: "Notification deleted successfully"}
}

