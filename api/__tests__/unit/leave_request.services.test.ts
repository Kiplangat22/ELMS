import { describe, it, expect, afterEach, jest, beforeEach } from "@jest/globals";
import * as leaveRequestService from "../../src/services/leave_request.services";
import * as leaveRequestRepository from "../../src/repositories/leave_request.repositories";
import * as leaveBalanceRepository from "../../src/repositories/leave_balance.repositories";
import * as notificationService from "../../src/services/notifications.services";

// Mock all external dependencies
jest.mock("../../src/repositories/leave_request.repositories");
jest.mock("../../src/repositories/leave_balance.repositories");
jest.mock("../../src/services/notifications.services");

describe("Leave Request Service Test Suite", () => {
  beforeEach(() => {
    // Mock current date to avoid past date issues
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15'));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  // calculateBusinessDays
  describe("calculateBusinessDays", () => {
    it("should calculate business days excluding weekends", async () => {
      const startDate = new Date('2025-01-20'); // Monday
      const endDate = new Date('2025-01-24');   // Friday
      
      const result = await leaveRequestService.calculateBusinessDays(startDate, endDate);
      
      expect(result).toBe(5); // 5 business days
    });

    it("should exclude weekends from calculation", async () => {
      const startDate = new Date('2025-01-20'); // Monday
      const endDate = new Date('2025-01-26');   // Sunday
      
      const result = await leaveRequestService.calculateBusinessDays(startDate, endDate);
      
      expect(result).toBe(5); // 5 business days (excludes Sat & Sun)
    });

    it("should return 1 for single day", async () => {
      const startDate = new Date('2025-01-20'); // Monday
      const endDate = new Date('2025-01-20');   // Same Monday
      
      const result = await leaveRequestService.calculateBusinessDays(startDate, endDate);
      
      expect(result).toBe(1);
    });
  });

  // createLeaveRequest
  describe("createLeaveRequest", () => {
    it("should create leave request with valid data", async () => {
      const mockBalance = { balance_days: 20 };
      const newLeaveRequest = {
        leave_type_id: 1,
        start_date: new Date('2025-01-20'),
        end_date: new Date('2025-01-24'),
        justification: "Family vacation",
        requested_at: new Date(),
      };

      (leaveRequestRepository.checkOverlap as jest.Mock).mockResolvedValue([]);
      (leaveBalanceRepository.getAllLeaveBalances as jest.Mock).mockResolvedValue(mockBalance);
      (leaveRequestRepository.createLeaveReq as jest.Mock).mockResolvedValue({ request_id: 1 });

      await leaveRequestService.createLeaveRequest(1, newLeaveRequest as any);

      expect(leaveRequestRepository.checkOverlap).toHaveBeenCalled();
      expect(leaveBalanceRepository.getAllLeaveBalances).toHaveBeenCalledWith(1);
      expect(leaveRequestRepository.createLeaveReq).toHaveBeenCalled();
    });

    it("should throw error for past start date", async () => {
      const newLeaveRequest = {
        leave_type_id: 1,
        start_date: new Date('2024-12-01'), // Past date
        end_date: new Date('2024-12-05'),
        justification: "Test",
        requested_at: new Date(),
      };

      await expect(leaveRequestService.createLeaveRequest(1, newLeaveRequest as any))
        .rejects
        .toThrow("Start date cannot be in the past");
    });

    it("should throw error when end date is before start date", async () => {
      const newLeaveRequest = {
        leave_type_id: 1,
        start_date: new Date('2025-01-25'),
        end_date: new Date('2025-01-20'), // Before start date
        justification: "Test",
        requested_at: new Date(),
      };

      await expect(leaveRequestService.createLeaveRequest(1, newLeaveRequest as any))
        .rejects
        .toThrow("End date must be after start date");
    });

    it("should throw error for insufficient leave balance", async () => {
      const mockBalance = { balance_days: 2 }; // Only 2 days available
      const newLeaveRequest = {
        leave_type_id: 1,
        start_date: new Date('2025-01-20'),
        end_date: new Date('2025-01-24'), // 5 days requested
        justification: "Test",
        requested_at: new Date(),
      };

      (leaveRequestRepository.checkOverlap as jest.Mock).mockResolvedValue([]);
      (leaveBalanceRepository.getAllLeaveBalances as jest.Mock).mockResolvedValue(mockBalance);

      await expect(leaveRequestService.createLeaveRequest(1, newLeaveRequest as any))
        .rejects
        .toThrow(/Insufficient leave balance/);
    });

    it("should throw error for overlapping leave requests", async () => {
      const newLeaveRequest = {
        leave_type_id: 1,
        start_date: new Date('2025-01-20'),
        end_date: new Date('2025-01-24'),
        justification: "Test",
        requested_at: new Date(),
      };

      (leaveRequestRepository.checkOverlap as jest.Mock).mockResolvedValue([{ request_id: 1 }]);

      await expect(leaveRequestService.createLeaveRequest(1, newLeaveRequest as any))
        .rejects
        .toThrow("You already have a leave request for this period");
    });
  });

  // approveLeaveRequest
  describe("approveLeaveRequest", () => {
    it("should approve pending leave request", async () => {
      const mockLeaveRequest = {
        request_id: 1,
        employee_id: 1,
        status: "Pending",
        total_days: 5,
      };

      (leaveRequestRepository.findLeaveReqById as jest.Mock).mockResolvedValue(mockLeaveRequest);
      (leaveBalanceRepository.deductBalance as jest.Mock).mockResolvedValue({});
      (leaveRequestRepository.updateLeaveReqStatus as jest.Mock).mockResolvedValue({ ...mockLeaveRequest, status: "Approved" });
      (notificationService.sendApprovalNotification as jest.Mock).mockResolvedValue(true);

      const result = await leaveRequestService.approveLeaveRequest(1, 2);

      expect(leaveRequestRepository.findLeaveReqById).toHaveBeenCalledWith(1);
      expect(leaveBalanceRepository.deductBalance).toHaveBeenCalledWith(1, 5);
      expect(leaveRequestRepository.updateLeaveReqStatus).toHaveBeenCalledWith(1, "Approved");
      expect(notificationService.sendApprovalNotification).toHaveBeenCalled();
      expect(result.status).toBe("Approved");
    });

    it("should throw error when leave request not found", async () => {
      (leaveRequestRepository.findLeaveReqById as jest.Mock).mockResolvedValue(null);

      await expect(leaveRequestService.approveLeaveRequest(999, 2))
        .rejects
        .toThrow("Leave request not found");
    });

    it("should throw error when approving non-pending request", async () => {
      const mockLeaveRequest = {
        request_id: 1,
        status: "Approved",
      };

      (leaveRequestRepository.findLeaveReqById as jest.Mock).mockResolvedValue(mockLeaveRequest);

      await expect(leaveRequestService.approveLeaveRequest(1, 2))
        .rejects
        .toThrow(/Cannot approve a request that is already/);
    });
  });

  // rejectLeaveRequest
  describe("rejectLeaveRequest", () => {
    it("should reject pending leave request", async () => {
      const mockLeaveRequest = {
        request_id: 1,
        employee_id: 1,
        status: "Pending",
      };

      (leaveRequestRepository.findLeaveReqById as jest.Mock).mockResolvedValue(mockLeaveRequest);
      (leaveRequestRepository.updateLeaveReqStatus as jest.Mock).mockResolvedValue({ ...mockLeaveRequest, status: "Rejected" });
      (notificationService.sendRejectionNotification as jest.Mock).mockResolvedValue(true);

      const result = await leaveRequestService.rejectLeaveRequest(1, 2);

      expect(leaveRequestRepository.updateLeaveReqStatus).toHaveBeenCalledWith(1, "Rejected");
      expect(notificationService.sendRejectionNotification).toHaveBeenCalled();
      expect(result.status).toBe("Rejected");
    });

    it("should throw error when rejecting non-pending request", async () => {
      const mockLeaveRequest = {
        request_id: 1,
        status: "Rejected",
      };

      (leaveRequestRepository.findLeaveReqById as jest.Mock).mockResolvedValue(mockLeaveRequest);

      await expect(leaveRequestService.rejectLeaveRequest(1, 2))
        .rejects
        .toThrow(/Cannot reject a request that is already/);
    });
  });

  // cancelLeaveRequest
  describe("cancelLeaveRequest", () => {
    it("should cancel own pending leave request", async () => {
      const mockLeaveRequest = {
        request_id: 1,
        employee_id: 1,
        status: "Pending",
      };

      (leaveRequestRepository.findLeaveReqById as jest.Mock).mockResolvedValue(mockLeaveRequest);
      (leaveRequestRepository.deleteLeaveReq as jest.Mock).mockResolvedValue({});

      const result = await leaveRequestService.cancelLeaveRequest(1, 1);

      expect(leaveRequestRepository.deleteLeaveReq).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: "Leave request cancelled successfully" });
    });

    it("should throw error when cancelling someone else's request", async () => {
      const mockLeaveRequest = {
        request_id: 1,
        employee_id: 2, // Different employee
        status: "Pending",
      };

      (leaveRequestRepository.findLeaveReqById as jest.Mock).mockResolvedValue(mockLeaveRequest);

      await expect(leaveRequestService.cancelLeaveRequest(1, 1))
        .rejects
        .toThrow("You can only cancel your own leave requests");
    });

    it("should throw error when cancelling non-pending request", async () => {
      const mockLeaveRequest = {
        request_id: 1,
        employee_id: 1,
        status: "Approved",
      };

      (leaveRequestRepository.findLeaveReqById as jest.Mock).mockResolvedValue(mockLeaveRequest);

      await expect(leaveRequestService.cancelLeaveRequest(1, 1))
        .rejects
        .toThrow("Only pending requests can be cancelled");
    });
  });

  // getEmployeeLeaveRequests
  it("should return employee leave requests", async () => {
    const mockRequests = [
      { request_id: 1, employee_id: 1, status: "Pending" },
      { request_id: 2, employee_id: 1, status: "Approved" },
    ];

    (leaveRequestRepository.findLeaveReqByEmployeeId as jest.Mock).mockResolvedValue(mockRequests);

    const result = await leaveRequestService.getEmployeeLeaveRequests(1);

    expect(leaveRequestRepository.findLeaveReqByEmployeeId).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockRequests);
  });

  it("should return empty array when no requests found", async () => {
    (leaveRequestRepository.findLeaveReqByEmployeeId as jest.Mock).mockResolvedValue(null);

    const result = await leaveRequestService.getEmployeeLeaveRequests(1);

    expect(result).toEqual([]);
  });

  // getPendingLeaveRequests
  it("should return all pending leave requests", async () => {
    const mockPendingRequests = [
      { request_id: 1, status: "Pending" },
      { request_id: 2, status: "Pending" },
    ];

    (leaveRequestRepository.findleaveReqPending as jest.Mock).mockResolvedValue(mockPendingRequests);

    const result = await leaveRequestService.getPendingLeaveRequests();

    expect(leaveRequestRepository.findleaveReqPending).toHaveBeenCalled();
    expect(result).toEqual(mockPendingRequests);
  });

  // getAllLeaveRequests
  it("should return all leave requests", async () => {
    const mockAllRequests = [
      { request_id: 1, status: "Pending" },
      { request_id: 2, status: "Approved" },
      { request_id: 3, status: "Rejected" },
    ];

    (leaveRequestRepository.findAllLeaveReq as jest.Mock).mockResolvedValue(mockAllRequests);

    const result = await leaveRequestService.getAllLeaveRequests();

    expect(leaveRequestRepository.findAllLeaveReq).toHaveBeenCalled();
    expect(result).toEqual(mockAllRequests);
  });

  // getLeaveRequestById
  it("should return specific leave request by ID", async () => {
    const mockRequest = { request_id: 1, employee_id: 1, status: "Pending" };

    (leaveRequestRepository.findLeaveReqById as jest.Mock).mockResolvedValue(mockRequest);

    const result = await leaveRequestService.getLeaveRequestById(1);

    expect(leaveRequestRepository.findLeaveReqById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockRequest);
  });

  // getEmployeeBalance
  describe("getEmployeeBalance", () => {
    it("should return existing employee balance", async () => {
      const mockBalance = { employee_id: 1, balance_days: 15 };

      (leaveBalanceRepository.getAllLeaveBalances as jest.Mock).mockResolvedValue(mockBalance);

      const result = await leaveRequestService.getEmployeeBalance(1);

      expect(leaveBalanceRepository.getAllLeaveBalances).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBalance);
    });

    it("should create balance if none exists", async () => {
      const mockNewBalance = { employee_id: 1, balance_days: 20 };

      (leaveBalanceRepository.getAllLeaveBalances as jest.Mock).mockResolvedValue(null);
      (leaveBalanceRepository.create as jest.Mock).mockResolvedValue(mockNewBalance);

      const result = await leaveRequestService.getEmployeeBalance(1);

      expect(leaveBalanceRepository.create).toHaveBeenCalledWith(1, 20.0);
      expect(result).toEqual(mockNewBalance);
    });
  });
});