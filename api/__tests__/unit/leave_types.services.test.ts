import { describe, it, expect, afterEach, jest } from "@jest/globals";
import * as leaveTypeRepository from "../../src/repositories/leave_types.repositories";
import * as leaveTypeServices from "../../src/services/leave_types.services";

// Mock all external dependencies
jest.mock("../../src/repositories/leave_types.repositories");

describe("Leave Type Service Test Suite", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Ensure no test affects another
  });

  // listLeaveTypes
  it("should return a list of leave types", async () => {
    const mockLeaveTypes = [
      {
        leave_type_id: 1,
        type_name: "Annual Leave",
        description: "Yearly vacation leave",
        default_days: 21,
      },
      {
        leave_type_id: 2,
        type_name: "Sick Leave",
        description: "Medical leave",
        default_days: 10,
      },
    ];

    (leaveTypeRepository.getAllLeaveTypes as jest.Mock).mockResolvedValue(mockLeaveTypes);

    const leaveTypes = await leaveTypeServices.listLeaveTypes();
    expect(leaveTypes).toEqual(mockLeaveTypes);
    expect(leaveTypeRepository.getAllLeaveTypes).toHaveBeenCalledTimes(1);
  });

  // getLeaveType
  it("should return a leave type by ID", async () => {
    const mockLeaveType = {
      leave_type_id: 1,
      type_name: "Annual Leave",
      description: "Yearly vacation leave",
      default_days: 21,
    };

    (leaveTypeRepository.getLeaveTypeById as jest.Mock).mockResolvedValue(mockLeaveType);

    const result = await leaveTypeServices.getLeaveType(1);

    expect(leaveTypeRepository.getLeaveTypeById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockLeaveType);
  });

  it("should throw error when leave type not found", async () => {
    (leaveTypeRepository.getLeaveTypeById as jest.Mock).mockResolvedValue(null);

    await expect(leaveTypeServices.getLeaveType(999))
      .rejects
      .toThrow("Leave type not found");
  });

  // createLeaveType
  it("should create a new leave type", async () => {
    const newLeaveType = {
      type_name: "Maternity Leave",
      description: "Leave for maternity",
      default_days: 90,
    };

    const mockCreatedLeaveType = {
      leave_type_id: 3,
      ...newLeaveType,
    };

    (leaveTypeRepository.createLeaveType as jest.Mock).mockResolvedValue(mockCreatedLeaveType);

    const result = await leaveTypeServices.createLeaveType(newLeaveType as any);

    expect(leaveTypeRepository.createLeaveType).toHaveBeenCalledWith(newLeaveType);
    expect(result).toEqual(mockCreatedLeaveType);
  });

  // updateLeaveType
  it("should update an existing leave type", async () => {
    const existingLeaveType = {
      leave_type_id: 1,
      type_name: "Annual Leave",
      description: "Yearly vacation leave",
      default_days: 21,
    };

    const updateData = {
      type_name: "Updated Annual Leave",
      description: "Updated description",
      default_days: 25,
    };

    const mockUpdatedLeaveType = {
      leave_type_id: 1,
      ...updateData,
    };

    (leaveTypeRepository.getLeaveTypeById as jest.Mock).mockResolvedValue(existingLeaveType);
    (leaveTypeRepository.updateLeaveType as jest.Mock).mockResolvedValue(mockUpdatedLeaveType);

    const result = await leaveTypeServices.updateLeaveType(1, updateData as any);

    expect(leaveTypeRepository.getLeaveTypeById).toHaveBeenCalledWith(1);
    expect(leaveTypeRepository.updateLeaveType).toHaveBeenCalledWith(1, updateData);
    expect(result).toEqual(mockUpdatedLeaveType);
  });

  it("should throw error when updating non-existent leave type", async () => {
    (leaveTypeRepository.getLeaveTypeById as jest.Mock).mockResolvedValue(null);

    await expect(leaveTypeServices.updateLeaveType(999, { type_name: "Test" } as any))
      .rejects
      .toThrow("Leave type not found");
  });

  // deleteLeaveType
  it("should delete an existing leave type", async () => {
    const existingLeaveType = {
      leave_type_id: 1,
      type_name: "Annual Leave",
      description: "Yearly vacation leave",
      default_days: 21,
    };

    (leaveTypeRepository.getLeaveTypeById as jest.Mock).mockResolvedValue(existingLeaveType);
    (leaveTypeRepository.deleteLeaveType as jest.Mock).mockResolvedValue(undefined);

    const result = await leaveTypeServices.deleteLeaveType(1);

    expect(leaveTypeRepository.getLeaveTypeById).toHaveBeenCalledWith(1);
    expect(leaveTypeRepository.deleteLeaveType).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: "Leave type deleted successfully" });
  });

  it("should throw error when deleting non-existent leave type", async () => {
    (leaveTypeRepository.getLeaveTypeById as jest.Mock).mockResolvedValue(null);

    await expect(leaveTypeServices.deleteLeaveType(999))
      .rejects
      .toThrow("Leave type not found");
  });
});