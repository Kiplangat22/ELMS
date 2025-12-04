import {Router}  from "express";
import * as leaveBalanceController from "../controllers/leave_balance.controllers";

const router = Router();


  router.get("/ListAllLeaveBal", leaveBalanceController.getAllLeaveBalances);
  router.get("/GetLeavebalByid/:employee_id", leaveBalanceController.getLeaveBalanceById);
  router.post("/CreateLeavBal", leaveBalanceController.createLeaveBalance);
  router.put("/UpdateleaveBal", leaveBalanceController.updateLeaveBalance);
  router.delete("/DeleteleaveBal/:balance_id", leaveBalanceController.deleteLeaveBalance);


export default router;