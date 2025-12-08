import {Router}  from "express";
import * as leaveBalanceController from "../controllers/leave_balance.controllers";

const router = Router();



router.get("/", leaveBalanceController.getAllLeaveBalances);
router.get("/:employee_id", leaveBalanceController.getLeaveBalanceById);
router.post("/", leaveBalanceController.createLeaveBalance);
router.put("/:balance_id", leaveBalanceController.updateLeaveBalance);
router.delete("/:balance_id", leaveBalanceController.deleteLeaveBalance);

export default router;
