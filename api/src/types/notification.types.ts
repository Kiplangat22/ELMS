export interface Notification{
    notification_id:number;
    employee_id: number;
    request_id:number;
    message:string;
    created_at:Date
}

export interface NewNotification{
    notification_id:number;
    employee_id: number;
    request_id:number;
    message:string;
}

export interface UpdateNotification{
    notification_id?:number;
    employee_id?: number;
    request_id?:number;
    message?:string;
}