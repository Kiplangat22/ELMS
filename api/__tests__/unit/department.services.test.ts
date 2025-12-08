import { describe, it, expect, afterEach, jest } from "@jest/globals";
import * as departmentService from "../../src/services/department.services";
import { getPool } from "../../src/db/config";
import sql from "mssql";

// Mock database config
jest.mock("../../src/db/config");

describe("Department Service Test Suite", () => {
  let mockPool: any;
  let mockRequest: any;

  beforeEach(() => {
    // Create mock request object
    mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };

    // Create mock pool
    mockPool = {
      request: jest.fn().mockReturnValue(mockRequest),
    };

    // Mock getPool to return our mock pool
    (getPool as jest.Mock).mockResolvedValue(mockPool);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // getDepartmentsService
  describe("getDepartmentsService", () => {
    it("should return all departments", async () => {
      const mockDepartments = [
        { department_id: 1, department_name: "IT" },
        { department_id: 2, department_name: "HR" },
        { department_id: 3, department_name: "Finance" },
      ];

      mockRequest.query.mockResolvedValue({ recordset: mockDepartments });

      const result = await departmentService.getDepartmentsService();

      expect(getPool).toHaveBeenCalled();
      expect(mockPool.request).toHaveBeenCalled();
      expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM Departments");
      expect(result).toEqual(mockDepartments);
    });

    it("should return empty array when no departments exist", async () => {
      mockRequest.query.mockResolvedValue({ recordset: [] });

      const result = await departmentService.getDepartmentsService();

      expect(result).toEqual([]);
    });
  });

  // createDepartmentService
  describe("createDepartmentService", () => {
    it("should create a new department", async () => {
      const departmentName = "Marketing";

      mockRequest.query.mockResolvedValue({});

      await departmentService.createDepartmentService(departmentName);

      expect(getPool).toHaveBeenCalled();
      expect(mockPool.request).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith("department_name", sql.VarChar, departmentName);
      expect(mockRequest.query).toHaveBeenCalledWith(
        "INSERT INTO Departments (department_name) VALUES (@department_name)"
      );
    });

    it("should handle empty department name", async () => {
      const departmentName = "";

      mockRequest.query.mockResolvedValue({});

      await departmentService.createDepartmentService(departmentName);

      expect(mockRequest.input).toHaveBeenCalledWith("department_name", sql.VarChar, "");
    });
  });

  // updateDepartmentService
  describe("updateDepartmentService", () => {
    it("should update an existing department", async () => {
      const departmentId = 1;
      const newDepartmentName = "Updated IT Department";

      mockRequest.query.mockResolvedValue({});

      await departmentService.updateDepartmentService(departmentId, newDepartmentName);

      expect(getPool).toHaveBeenCalled();
      expect(mockPool.request).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith("department_id", sql.Int, departmentId);
      expect(mockRequest.input).toHaveBeenCalledWith("department_name", sql.VarChar, newDepartmentName);
      expect(mockRequest.query).toHaveBeenCalledWith(
        "UPDATE Departments SET department_name = @department_name WHERE department_id = @department_id"
      );
    });

    it("should handle updating non-existent department", async () => {
      const departmentId = 999;
      const newDepartmentName = "Non-existent";

      mockRequest.query.mockResolvedValue({ rowsAffected: [0] });

      await departmentService.updateDepartmentService(departmentId, newDepartmentName);

      expect(mockRequest.query).toHaveBeenCalled();
    });
  });

  // deleteDepartmentService
  describe("deleteDepartmentService", () => {
    it("should delete a department", async () => {
      const departmentId = 1;

      mockRequest.query.mockResolvedValue({});

      await departmentService.deleteDepartmentService(departmentId);

      expect(getPool).toHaveBeenCalled();
      expect(mockPool.request).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith("department_id", sql.Int, departmentId);
      expect(mockRequest.query).toHaveBeenCalledWith(
        "DELETE FROM Departments WHERE department_id = @department_id"
      );
    });

    it("should handle deleting non-existent department", async () => {
      const departmentId = 999;

      mockRequest.query.mockResolvedValue({ rowsAffected: [0] });

      await departmentService.deleteDepartmentService(departmentId);

      expect(mockRequest.query).toHaveBeenCalled();
    });
  });
});