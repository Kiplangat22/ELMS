//interaction with db 
import {pool} from "mssql";
import {getPool} from "../db/config";
import { NewEmployee,Employee,UpdateEmployee } from "../types/employess.types"; 


//CREATE EMPLOYEE
export const createEmployee = async (employee: NewEmployee) => {
    const pool = await getPool();
    await pool
    .request()
    .input('first_name',employee.first_name)
    .input('last_name',employee.last_name)
    .input('email',employee.email)
    .input('date_joined',employee.date_joined )
    .input('role',employee.role)
    .input('hashed_pass',employee.hashed_pass)
    .input('department_id',employee.department_id)
    .query('INSERT INTO Employees (first_name,last_name,email,date_joined,role,hashed_pass,department_id) VALUES (@first_name,@last_name,@email,@date_joined,@role,@hashed_pass,@department_id)')

    return {message:'employee created sucefully '};
}

//DELTE EMPLOYEE
export const deleteEmployee = async (employee_id:number) => {
    const pool = await getPool();
    const result = await pool
    .request()
    .input('employee_id',employee_id)
    .query('DELETE FROM Employees WHERE employee_id = @employee_id')

    if (result.rowsAffected[0] === 0) {
        throw new Error('Employee not found');
    }

      return{message:"Employee deleted successfully "};



}
//GET EMPLOYEE BY ID 
export const getEmployeeById = async (employee_id:number):Promise <Employee[]> => {
    const pool = await getPool();
    const result= await pool
    .request()
    .input('employee_id',employee_id)
    .query('SELECT * FROM Employees WHERE employee_id = @employee_id');
    return result.recordset[0];


}
//LIST ALL EMPLOYEES  
export const getEmployee = async ():Promise <Employee[]> => {
    const pool = await getPool();
    const result = await pool
    .request()
    .query('SELECT * FROM Employees')  
    
    return result.recordset;

}

//UPDATING AN EMPLOYEE
export  const UpdateEmploye = async (employee_id:number, employee:UpdateEmployee )=> {
 const pool = await getPool();
 await pool
 .request()
     .input('employee_id',employee_id)
     .input('first_name', employee.first_name)
     .input('last_name', employee.last_name)
     .input('email', employee.email)
     .input('phone_number', employee.phone_number)
     .input('hashed_pass', employee.hashed_pass)
     .input('role', employee.role)
     .input('is_active', employee.is_active)
     .input('department_id', employee.department_id)
     .query('UPDATE Employees SET first_name = @first_name, last_name = @last_name, email = @email, phone_number = @phone_number, hashed_pass = @hashed_pass, role = @role,is_active=@is_active,department_id=@department_id  WHERE employee_id = @employee_id');

     return { message: 'Employee updated successfully' };


 }
//AUTHENTICATION ....
//find employess by email
export const  getEmployeeByEmail = async (email:string):Promise<Employee| null>=>{

    const pool = await getPool();
    const result =await pool
    .request ()
    .input('email',email)
    .query ('SELECT * FROM Employees WHERE email=@email');

    return result.recordset[0] || null;

}

// SET VERIFICATION CODE FOR EMPLOYEEE on register 
export const setVerificationCode = async(email:string,code:string)=>{
    const pool = await getPool();
    await pool
    .request()
    .input("email",email)   
    .input ("code",code)
    .query ('UPDATE Employees SET verification_code = @code, is_verified = 0 WHERE email = @email');

    return { message: 'Verification code saved' };

}

//VERIFY EMPLOYEE BY SETTING is_verified to true 

export  const verifyEmployee = async (email:string) => {
    const pool = await getPool();
    await pool
    .request()
    .input('email',email)
    .query('UPDATE Employees SET is_verified = 1, verification_code = NULL WHERE email = @email');

    return { message: 'Employee verified successfully' };




}









