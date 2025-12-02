import { Express}  from "express";
import * as leaveBalanceController from "../controllers/leave_balance.controllers";

const leaveBalanceRoutes = (app: Express) => {
  app.get("/ListAllLeaveBal", leaveBalanceController.getAllLeaveBalances);
  app.get("/GetLeavebalByid/:employee_id", leaveBalanceController.getLeaveBalanceById);
  app.post("/CreateLeavBal", leaveBalanceController.createLeaveBalance);
  app.put("/UpdateleaveBal", leaveBalanceController.updateLeaveBalance);
  app.delete("/DeleteleaveBal/:balance_id", leaveBalanceController.deleteLeaveBalance);
};

export default leaveBalanceRoutes;