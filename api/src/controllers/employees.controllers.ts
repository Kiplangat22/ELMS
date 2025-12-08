// Employee Controller
import  { Request, response, Response } from 'express';
import  * as employeeService from'../services/employees.services';
import { Employee} from '../types/employess.types';   
import { error } from 'console';

//CREATE AN EMPLOYEE
export const createEmployee = async (req: Request, res: Response) => {

    try{
        const employee = req.body;
        console.log( employee);
        const result = await employeeService.createEmployee(employee);
        res.status(201).json(result);
        
    }catch (error:any ) {
        res.status(500).json({ error:error .message });
        //console.log(error);
    }

};

// DELETE EMPLOYEE BY ID 
 export const deleteEmployee = async(req:Request,res:Response) => {

    const id =parseInt(req.params.employee_id);
//bad req if  id aint a nomber
    if(isNaN(id)){
        return res.status(400).json({ message:'invalid Employee id' });

    }
    //else proceed 
    try{

        const result = await employeeService.deleteEmployee(id);
        res.status(200).json(result)

    }catch(error:any){

        //if Employee doesnt exist
        if(error.message ==='Employee not found '){
            return res.status(401).json({ message:'Employee not found '})

        }else{
            res.status(500).json({ error:error.message });
            console.log(error.message);


        }


    }


 }

//GET EMPLOYEEEE BY ID 
export const getEmployeeById = async (req: Request, res: Response) => {

        const id =parseInt(req.params.employee_id);
    try{
        const employee = await employeeService.getEmployeeById(id);
        if(employee){
            res.status(200).json(employee);
        } else {
            res.status(404).json({message: 'Employee not found'});
            console.log(error);
        }

    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }

};
//lIST ALL EMPLOYESS
export const getAllEmployees = async (req: Request, res: Response) => {

    try {
        const employees = await employeeService.listEmployee();
        res.status(200).json(employees);
    } catch (error:any ) {
        res.status(500).json({ error: error.message });
    }
 };

//UPDATE EMPLOYEEE
export const UpdateEmployee = async(req:Request, res :Response)=>{

    const id = parseInt(req.params.employee_id);
    //bad req if employee_id  not found 

    if (isNaN(id)){
        return res.status(400).json({message:'invalid employee_id '})

    }
    //proced to update 

    try {
        const employee = req.body;
        const result = await employeeService.updateEmployee(id,employee);
        res.status(200).json(result)
       
        
    } catch (error: any) {
       if(error.message ==='Employee not found '){
        return res .status(404).json({message:'Employee not found '})

       }else {
        return res.status(500).json({error:error.message})
  

       }
    }
};

//LOGIN CONTROLLER 
export const loginEmployee = async (req: Request, res: Response) => {
    try {
        const { email, hashed_pass } = req.body;

        const result = await employeeService.loginEmployee(email, hashed_pass);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Employee not found') {
            res.status(404).json({ error: error.message });
        } else if (error.message === 'Invalid credentials') {
            res.status(401).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
}

// VERIFICATION CONTROLLER 
export const verifyEmployee = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;
    
        if (!email || !code) {
            return res.status(400).json({ message: 'Email and verification code are required' });
        }

        const result = await employeeService.verifyEmployee(email, code);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};