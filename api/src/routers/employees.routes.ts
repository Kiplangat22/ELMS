import { Express } from "express";  
import * as employeesControllers from "../controllers/employees.controllers";

 const employeesRoutes =(app: Express) => {
  
    app.post("/addEmployees", employeesControllers.createEmployee);
    app.delete("/deleteEmployees/:employee_id", employeesControllers.deleteEmployee);
    app.get("/getEmployeeById/:employee_id", employeesControllers.getEmployeeById);
    app.get("/getAllEmployees", employeesControllers.getAllEmployees)
    app.post("/loginEmployee", employeesControllers.loginEmployee)
    app.put("/updateEmployee/:employee_id", employeesControllers.UpdateEmployee)
    app.post("/verifyEmployee", employeesControllers.verifyEmployee)



 };

 export default employeesRoutes;