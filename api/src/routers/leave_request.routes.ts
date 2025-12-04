import { Router } from "express";
import * as leaveController from "../controllers/leave_request.controllers";

const router = Router();


// EMPLOYEE routes
router.post("/CreateLeaveReq", leaveController.createLeaveRequest); // Create a new leave request
router.get("/GetLeavReq", leaveController.getMyLeaveRequests);     // Get logged-in employee's requests
router.get("/MyBal", leaveController.getMyBalance);          // Get employee leave balance
router.delete("/:request_id/cancel", leaveController.cancelLeaveRequest); // Cancel a pending request

// ADMIN / MANAGER routes
router.get("/pending", leaveController.getPendingRequests);       // Get pending requests
router.get("/leaveReq", leaveController.getAllRequests);                  // Get all leave requests
router.get("/ReqById/:request_id", leaveController.getLeaveRequestById);  // Get specific request by ID
router.patch("/:request_id/approve", leaveController.approveLeaveRequest); // Approve request
router.patch("/:request_id/reject", leaveController.rejectLeaveRequest);   // Reject request

// Notifications
router.get("/notifications/my", leaveController.getMyNotifications);   // Employee notifications
router.get("/notifications", leaveController.getAllNotifications);     // Admin all notifications
router.delete("/notifications/:notification_id", leaveController.deleteNotification); // Delete a notification


export default router;