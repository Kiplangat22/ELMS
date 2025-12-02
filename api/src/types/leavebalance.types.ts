export interface Leave_Balance {
    balance_id: number;
    employee_id: number;
    balance_days: number;
}

export interface NewLeave_Balance{
    balance_id: number;
    employee_id: number;
    balance_days: number; 
}

export interface UpdateLeave_Balance{
    balance_id?: number;
    employee_id?: number;
    balance_days?: number;  
}
