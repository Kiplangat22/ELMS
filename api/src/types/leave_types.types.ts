export interface LeaveType {
    leave_type_id: number;
    type_name: string;
    description: string;
    default_days: number;
    created_at: Date;
}

export interface NewLeaveType {
    type_name: string;
    description: string;
    default_days: number;
     created_at: Date;

}

export interface UpdateLeaveType {
    type_name?: string;
    description?: string;
    default_days?: number;
}