//business logic 
import * as employessRepositories from '../repositories/employees.repositories'
import { NewEmployee,Employee, UpdateEmployee  } from '../types/employess.types';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import dotenv from 'dotenv';
import { sendEmail } from '../mailer/mailers';
import { emailTemplate } from '../mailer/email_templates';

dotenv.config();

//CREATING THE EMPLOYEEEEE

export const createEmployee = async(employee: NewEmployee) => {

    if(employee.hashed_pass){

       employee.hashed_pass =await  bcrypt.hash(employee.hashed_pass, 10)
       
     }
     //generate the verification code 

     const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
     //save Employee to db

     const result = await employessRepositories.createEmployee(employee);

     //save the verification code 

     await employessRepositories.setVerificationCode(employee.email, verificationCode);
 

 //send welcome email to user 

    await sendEmail(
        employee.email,
        'welcome to the  ELMS BY WYCLIF',
        emailTemplate.welcome(employee.first_name)

    );

    await sendEmail(
        employee.email,
        'Verify your email for the  ELMS',
        emailTemplate.verify(employee.first_name,verificationCode)
    );
    
    return {message :'Employee created successfully.Verification code sent to email'};

}

//DELETING THE EMPLOYEEEEE
export const deleteEmployee= async(employee_id: number) => {
    await ensureEmployeeExists(employee_id);
    return await employessRepositories.deleteEmployee(employee_id);

}
//GETING EMPLOYEE BY ID
export const getEmployeeById = async (employee_id:number) =>await employessRepositories.getEmployeeById(employee_id);


//LISTING ALL EMPLOYESS 
export const listEmployee = async ( ) => await employessRepositories.getEmployee();

//UPDATING EMPLOYEE

export const updateEmployee = async(employee_id:number, employee: UpdateEmployee) => {
    await ensureEmployeeExists(employee_id);
    //has pass
    if(employee.hashed_pass){
        employee.hashed_pass=await bcrypt.hash(employee.hashed_pass,10)    
        
        console.log (employee.hashed_pass)

    }

    return await employessRepositories.UpdateEmploye(employee_id, employee);


}
//REUSABLE fnc TO CHECK IS USER EXIST 
const ensureEmployeeExists = async (employee_id: number) => {
    const employee = await employessRepositories.getEmployeeById(employee_id);
    if (!employee) {
        throw new Error('Employee not found');
    }
    return employee;
}

//AUTHENTICATION
  //login in user 

  export const loginEmployee = async ( email:string, hashed_pass:string ) => {

    //find emply by email
    const employee = await employessRepositories.getEmployeeByEmail(email);
    if (!employee) {
        throw new Error('Employee not found')

    }
    //compare the login pass with hashed stored pass

    const isMatch = await bcrypt.compare(hashed_pass,employee.hashed_pass);

    if(!isMatch){

        throw new Error('Invalid credentials')

    }

    // jwt payload
     const payload = {
        sub : employee.employee_id,  //subject employee_id
        first_name : employee.first_name,
        last_name: employee.last_name,
        exp:Math.floor(Date.now() /1000)+(60*60),

     }

     //generate jwt
    const secret = process.env.JWT_SECRET as string;
    if (!secret) throw new Error('JWT secret not defined');
    const token = jwt.sign(payload, secret);

    //return token+employee details

    return{
        message:'Login successfully',
        token,
        employee:{
            id:employee.employee_id,
            first_name:employee.first_name,
            last_name:employee.last_name,
            email:employee.email,
            department_id:employee.department_id,
            isActive:employee.is_active,
            role:employee.role


        }



    }



  }

// VERIFY USER WITH email code 

export  const  verifyEmployee = async (email:string,code:string) => {
    const employee = await employessRepositories.getEmployeeByEmail(email);
    if (!employee) {
        throw new Error('Employee not found');
    }

    if (employee.verification_code!== code) {
        throw new Error('Invalid verification code');
    }

    // Mark user as verified
    await employessRepositories.verifyEmployee(email);

    // Send success notification
    await sendEmail(
        employee.email,
        'Your email has been verified - ELMS',
        emailTemplate.verifiedSuccess(employee.first_name)
    );

    return { message: 'Employee verified successfully 😉😉 progress' };

}

  





