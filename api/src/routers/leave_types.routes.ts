import { Router } from "express";
import * as leaveTypeController from "../controllers/leave_types.controller";

const router = Router();

router.get("/", leaveTypeController.getLeaveTypes);
router.get("/:leave_type_id", leaveTypeController.getLeaveTypeById);    
router.post("/", leaveTypeController.createLeaveType);
router.put("/:leave_type_id", leaveTypeController.updateLeaveType);
router.delete("/:leave_type_id", leaveTypeController.deleteLeaveType);

export default router;
