import { getPool } from "../db/config";
import { Leave_Balance, NewLeave_Balance, UpdateLeave_Balance } from  "../types/leavebalance.types";

//get all leave balance for  any employee findByEmployeeId
export const getAllLeaveBalances = async (employee_id:number) => {
    const pool = await getPool();
    const result = await pool
    .request()
    .input('employee_id',employee_id)
    .query("SELECT * FROM Leave_Balance WHERE employee_id = @employee_id");
    return result.recordset[0];

};

//cretae initial balance for the employee
export const create = async (employee_id:number, balance_days:number) => {

      const pool = await getPool();
      const result = await pool
        .request()
        .input('employee_id', employee_id)
        .input('balance_days', balance_days)
        .query(`
            INSERT INTO Leave_Balance (employee_id, balance_days)
            OUTPUT INSERTED.*
            VALUES (@employee_id, @balance_days)
        `);
    
    return result.recordset[0];

}
//Deduct day from the balance 
export const deductBalance = async (employee_id:number,days:number) => {

    const pool = await getPool();
    const result = await pool
        .request()
        .input('employee_id', employee_id)
        .input('days', days)

        .query(`
            UPDATE Leave_Balance 
            SET balance_days = balance_days - @days
            OUTPUT INSERTED.*
            WHERE employee_id = @employee_id
        `);
        return result.recordset[0];
}


//Add back days to balance when leave rejected
export const addBalance = async (employee_id: number, days: number) => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('employee_id',  employee_id)
        .input('days', days)
        .query(`
            UPDATE Leave_Balance 
            SET balance_days = balance_days + @days
            OUTPUT INSERTED.*
            WHERE employee_id = @employee_id
        `);

        return result.recordset[0];

        };
//Update balance directly  on leave acceptance 
export const updateBalance = async (employee_id: number, balance_days: number) => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('employee_id',employee_id)
        .input('balance_days', balance_days)
        .query(`
            UPDATE Leave_Balance 
            SET balance_days = @balance_days
            OUTPUT INSERTED.*
            WHERE employee_id = @employee_id
        `);
    
    return result.recordset[0];
};

// Get all balances (for admin)
export const findAll = async (): Promise<Leave_Balance[]> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .query(`
            SELECT lb.*, e.first_name, e.last_name, e.email, d.department_name
            FROM Leave_Balance lb
            INNER JOIN Employees e ON lb.employee_id = e.employee_id
            LEFT JOIN Departments d ON e.department_id = d.department_id
            ORDER BY e.last_name, e.first_name
        `);
    
    return result.recordset;
   
};
//deleting the leave balance 
export const deleteLeaveBalance = async (balance_id: number) => {
    const pool = await getPool();
    const result = await pool.request()
        .input("balance_id", balance_id)
        .query("DELETE FROM Leave_Balance WHERE balance_id = @balance_id");

        if (result.rowsAffected[0] === 0) {
        throw new Error("Leave Balance not Found");
    }

    return { message: "Leave balance deleted successfully." };
};

   
    

