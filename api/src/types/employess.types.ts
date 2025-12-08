export interface Employee {
    employee_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    hashed_pass: string;
    role: string;
    date_joined: Date;
    is_active: boolean;
    department_id: number;
    is_verified?: boolean; // new field to track if Employee is verified
    verification_code?: string | null; // new field to store verification code
}
export interface NewEmployee {
    first_name: string;
    last_name: string;
    email: string;
    hashed_pass: string;
    role: string;
    department_id: number;
    date_joined: Date;
    employee_id:number;
}
export interface UpdateEmployee {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    hashed_pass?: string;
    role?: string;
    is_active?: boolean;
    department_id?: number;
}