export interface Leave_Request {
    length: number;
    request_id: number;
    employee_id:number;
    leave_type_id:number;
    start_date:Date;
    end_date:Date;
    total_days:number;
    justification:Text
    status:'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
    requested_at:Date;

}
export interface New_leave_Request {
    employee_id:number;
    leave_type_id:number;
    start_date:Date;
    end_date:Date;
    total_days:number;
    justification:Text
    requested_at:Date;

}
export interface Update_leave_Request {
    employee_id:number;
    leave_type_id:number;
    start_date:Date;
    end_date:Date;
    total_days:number;
    justification:Text
    requested_at:Date;

}