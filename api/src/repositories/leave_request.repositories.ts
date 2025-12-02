const sql = require('mssql');
import {getPool} from "../db/config";
import { Leave_Request, New_leave_Request } from "../types/leave_request.type";
import { Employee } from "../types/employess.types";

    // Create a new leave request
    export const createLeaveReq= async(leaveReq:New_leave_Request)=> {
        
            const pool = await getPool();
             await pool
                .request()
                .input('employee_id', leaveReq.employee_id)
                .input('leave_type_id', leaveReq.leave_type_id)
                .input('start_date',  leaveReq.start_date)
                .input('end_date',  leaveReq.end_date)
                .input('total_days', leaveReq.total_days)
                .input('justification', leaveReq.justification)

                .query('INSERT INTO Leave_Request(employee_id, leave_type_id, start_date, end_date, total_days, justification)VALUES (@employee_id, @leave_type_id, @start_date, @end_date, @total_days, @justification)');

            
              return {message:'leaveReq created succesfully'};
    
        
        }

    // Get leaveReq by ID
   export const findLeaveReqById = async (request_id: number): Promise<Leave_Request> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('request_id', request_id)
        .query(`
            SELECT 
                lr.*, 
                e.first_name, e.last_name, e.email,
                lt.type_name, lt.default_days
            FROM Leave_Request lr
            INNER JOIN Employees e ON lr.employee_id = e.employee_id
            INNER JOIN Leave_Type lt ON lr.leave_type_id = lt.leave_type_id
            WHERE lr.request_id = @request_id
        `);
        
    return result.recordset[0];
};  
  // Get all leave requests for an employee
export const findLeaveReqByEmployeeId=async(employee_id:number): Promise<Leave_Request> => {
        
            const pool = await getPool();
            const result = await pool
                .request()
                .input('employee_id', employee_id)
                .query(`
                    SELECT lr.*, 
                           lt.type_name
                    FROM Leave_Request lr
                    INNER JOIN Leave_Type lt ON lr.leave_type_id = lt.leave_type_id
                    WHERE lr.employee_id = @employee_id
                    ORDER BY lr.requested_at DESC
                `);
                return result.recordset[0];
        

    }

    // Get all pending leave requests(admin.......)
    export const  findleaveReqPending=async()=> {
    
            const pool = await getPool();
            const result = await pool
               .request()
                .query(`
                    SELECT lr.*, 
                           e.first_name, e.last_name, e.email,
                           lt.type_name,
                           d.department_name
                    FROM Leave_Request lr
                    INNER JOIN Employees e ON lr.employee_id = e.employee_id
                    INNER JOIN Leave_Type lt ON lr.leave_type_id = lt.leave_type_id
                    LEFT JOIN Departments d ON e.department_id = d.department_id
                    WHERE lr.status = 'Pending'
                    ORDER BY lr.requested_at ASC
                `);
            return result.recordset;
        
    }

    // Get all leave requests no mater the status  (for admin.....)
    export const findAllLeaveReq=async():Promise<Leave_Request[]> => {
        
            const pool = await getPool();
            const result = await pool
                .request()
                .query(`
                    SELECT lr.*, 
                           e.first_name, e.last_name, e.email,
                           lt.type_name,
                           d.department_name
                    FROM Leave_Request lr
                    INNER JOIN Employees e ON lr.employee_id = e.employee_id
                    INNER JOIN Leave_Type lt ON lr.leave_type_id = lt.leave_type_id
                    LEFT JOIN Departments d ON e.department_id = d.department_id
                    ORDER BY lr.requested_at DESC
                `);

            return result.recordset;
                
        

    }

    // Update leave request status
    export const  updateLeaveReqStatus=async(request_id:number, status:string) =>{
        
            const pool = await getPool();
            const result = await pool
                .request()
                .input('request_id', request_id)
                .input('status', status)
                .query(`
                    UPDATE Leave_Request 
                    SET status = @status
                    OUTPUT INSERTED.*
                    WHERE request_id = @request_id
                `);
            return result.recordset[0];
    
    }

    // Delete leave request
    export const deleteLeaveReq=async(request_id:number) =>{
        
            const pool = await getPool();
            await pool
                .request()
                .input('request_id',  request_id)
                .query('DELETE FROM Leave_Request WHERE request_id = @request_id');
            
                 return{message:"LeaveReq deleted suceffuly "};
        
    }

    // Check for overlapping leave requests
    export const checkOverlap= async(employee_id:number, start_date:Date, end_date:Date, excludeRequestId = null)=> {
        try {
            const pool = await getPool();
            const request = pool
                .request()
                .input('employee_id',employee_id)
                .input('start_date',start_date)
                .input('end_date', end_date);

            let query = `
                SELECT * FROM Leave_Request
                WHERE employee_id = @employee_id
                AND status IN ('Pending', 'Approved')
                AND (
                    (@start_date BETWEEN start_date AND end_date)
                    OR (@end_date BETWEEN start_date AND end_date)
                    OR (start_date BETWEEN @start_date AND @end_date)
                )
            `;

            if (excludeRequestId) {
                request.input('exclude_id', sql.Int, excludeRequestId);
                query += ' AND request_id != @exclude_id';
            }

            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            throw{error:error} ;
        }
    }