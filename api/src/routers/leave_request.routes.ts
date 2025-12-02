import { Express } from "express";
import * as leaveController from "../controllers/leave_request.controllers";

const  LeaveRequestRoutes = (app: Express) => {

// EMPLOYEE routes
app.post("/CreateLeaveReq", leaveController.createLeaveRequest); // Create a new leave request
app.get("/GetLeavReq", leaveController.getMyLeaveRequests);     // Get logged-in employee's requests
app.get("/MyBal", leaveController.getMyBalance);          // Get employee leave balance
app.delete("/:request_id/cancel", leaveController.cancelLeaveRequest); // Cancel a pending request

// ADMIN / MANAGER routes
app.get("/pending", leaveController.getPendingRequests);       // Get pending requests
app.get("/leaveReq", leaveController.getAllRequests);                  // Get all leave requests
app.get("/ReqById/:request_id", leaveController.getLeaveRequestById);  // Get specific request by ID
app.patch("/:request_id/approve", leaveController.approveLeaveRequest); // Approve request
app.patch("/:request_id/reject", leaveController.rejectLeaveRequest);   // Reject request

// Notifications
app.get("/notifications/my", leaveController.getMyNotifications);   // Employee notifications
app.get("/notifications", leaveController.getAllNotifications);     // Admin all notifications
app.delete("/notifications/:notification_id", leaveController.deleteNotification); // Delete a notification







}

export default LeaveRequestRoutes;