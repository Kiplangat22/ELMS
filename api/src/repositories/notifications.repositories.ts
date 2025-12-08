import { getPool } from "../db/config";
import { Notification, UpdateNotification } from "../types/notification.types";

// ✔ Get all notifications (admin)
export const getAllNotifications = async (): Promise<Notification[]> => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT * FROM Notification ORDER BY created_at DESC
    `);
    return result.recordset;
};

// ✔ Get notifications by employee_id (employee view)
export const getNotificationByEmployeeId = async (employee_id: number): Promise<Notification[]> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input("employee_id", employee_id)
        .query(`
            SELECT n.*, lr.status, lr.start_date, lr.end_date, lr.total_days
            FROM Notification n
            INNER JOIN Leave_Request lr ON n.request_id = lr.request_id
            WHERE n.employee_id = @employee_id
            ORDER BY n.created_at DESC
        `);

    return result.recordset;
};

// ✔ Get single notification by notification_id (admin)
export const getNotificationByNotificationId = async (notification_id: number): Promise<Notification | null> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input("notification_id", notification_id)
        .query(`SELECT * FROM Notification WHERE notification_id = @notification_id`);

    return result.recordset[0] || null;
};

// ✔ Create a new notification
export const createNotification = async (
    employee_id: number,
    request_id: number,
    message: string
) => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input("employee_id", employee_id)
        .input("request_id", request_id)
        .input("message", message)
        .query(`
            INSERT INTO Notification (employee_id, request_id, message)
            OUTPUT INSERTED.*
            VALUES (@employee_id, @request_id, @message)
        `);

    return {
        message: "Notification created successfully",
        notification: result.recordset[0],
    };
};

// ✔ Update a notification
export const updateNotification = async (
    notification_id: number,
    updates: UpdateNotification
) => {
    const { employee_id, request_id, message } = updates;
    const pool = await getPool();
    await pool
        .request()
        .input("notification_id", notification_id)
        .input("employee_id", employee_id ?? null)
        .input("request_id", request_id ?? null)
        .input("message", message ?? null)
        .query(`
            UPDATE Notification SET
                employee_id = COALESCE(@employee_id, employee_id),
                request_id = COALESCE(@request_id, request_id),
                message = COALESCE(@message, message)
            WHERE notification_id = @notification_id
        `);

    return { message: "Notification updated successfully" };
};

// ✔ Delete a notification
export const deleteNotification = async (notification_id: number) => {
    const pool = await getPool();
    await pool
        .request()
        .input("notification_id", notification_id)
        .query(`DELETE FROM Notification WHERE notification_id = @notification_id`);

    return { message: "Notification deleted successfully" };
};
