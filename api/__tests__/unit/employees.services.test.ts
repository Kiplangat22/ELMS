import * as employeeRepositories from "../../src/repositories/employees.repositories";
import * as employeeServices from "../../src/services/employees.services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../src/mailer/mailers";
import { emailTemplate } from "../../src/mailer/email_templates";
import { describe, it, expect, afterEach, jest } from "@jest/globals";


// Mock all external dependencies
jest.mock("../../src/repositories/employees.repositories");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../src/mailer/mailers");
jest.mock("../../src/mailer/email_templates");

describe("Employee Service Test Suite", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Ensure no test affects another
  });

  // listEmployee
  it("should return a list of employees", async () => {
    const mockEmployees = [
      {
        employee_id: 1,
        first_name: "Alice",
        last_name: "Mwangi",
        email: "alice@company.com",
        hashed_pass: "hashedpassword",
        role: "manager",
        date_joined: new Date('2023-01-01'),
        is_active: true,
        department_id: 1,
      },
      {
        employee_id: 2,
        first_name: "Brian",
        last_name: "Kemboi",
        email: "brian@company.com",
        hashed_pass: "hashedpassword",
        role: "employee",
        date_joined: new Date('2023-01-01'),
        is_active: true,
        department_id: 2,
      },
    ];

    (employeeRepositories.getEmployee as jest.MockedFunction<typeof employeeRepositories.getEmployee>).mockResolvedValue(mockEmployees);

    const employees = await employeeServices.listEmployee();
    expect(employees).toEqual(mockEmployees);
    expect(employeeRepositories.getEmployee).toHaveBeenCalledTimes(1);
  });

  // createEmployee
  it("should hash password, save employee, and send verification email", async () => {
    const mockEmployee = {
      first_name: "Charlie",
      last_name: "Otieno",
      email: "charlie@company.com",
      phone_number: "0711000003",
      department_id: 1,
      role: "employee",
      hashed_pass: "password123",
    };

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (employeeRepositories.createEmployee as jest.MockedFunction<typeof employeeRepositories.createEmployee>).mockResolvedValue({ message: "Employee created successfully" });
    (employeeRepositories.setVerificationCode as jest.MockedFunction<typeof employeeRepositories.setVerificationCode>).mockResolvedValue({ message: "Verification code saved" });
    (sendEmail as jest.Mock).mockResolvedValue(true);
    (emailTemplate.welcome as jest.Mock).mockReturnValue("<p>Welcome to ELMS</p>");
    (emailTemplate.verify as jest.Mock).mockReturnValue("<p>Your verification code is 123456</p>");

    const result = await employeeServices.createEmployee(mockEmployee as any);

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(employeeRepositories.createEmployee).toHaveBeenCalled();
    expect(employeeRepositories.setVerificationCode).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledTimes(2); // Welcome and verification emails
    expect(result).toEqual({ message: "Employee created successfully.Verification code sent to email" });
  });

  // verifyEmployee
  it("should verify employee with correct code", async () => {
    const mockEmployee = {
      employee_id: 1,
      first_name: "Brian",
      last_name: "Kemboi",
      email: "brian@company.com",
      hashed_pass: "hashed",
      role: "employee",
      date_joined: new Date(),
      is_active: true,
      department_id: 1,
      verification_code: "123456",
      is_verified: false,
    };

    (employeeRepositories.getEmployeeByEmail as jest.MockedFunction<typeof employeeRepositories.getEmployeeByEmail>).mockResolvedValue(mockEmployee as any);
    (employeeRepositories.verifyEmployee as jest.MockedFunction<typeof employeeRepositories.verifyEmployee>).mockResolvedValue({ message: "Employee verified successfully" });
    (sendEmail as jest.Mock).mockResolvedValue(true);
    (emailTemplate.verifiedSuccess as jest.Mock).mockReturnValue("<p>Account Verified</p>");

    const result = await employeeServices.verifyEmployee("brian@company.com", "123456");

    expect(employeeRepositories.getEmployeeByEmail).toHaveBeenCalledWith("brian@company.com");
    expect(employeeRepositories.verifyEmployee).toHaveBeenCalledWith("brian@company.com");
    expect(sendEmail).toHaveBeenCalled();
    expect(result).toEqual({ message: "Employee verified successfully 😉😉 progress" });
  });

  it("should throw error for invalid verification code", async () => {
    const mockEmployee = {
      employee_id: 1,
      first_name: "Brian",
      last_name: "Kemboi",
      email: "brian@company.com",
      hashed_pass: "hashed",
      role: "employee",
      date_joined: new Date(),
      is_active: true,
      department_id: 1,
      verification_code: "123456",
      is_verified: false,
    };

    (employeeRepositories.getEmployeeByEmail as jest.MockedFunction<typeof employeeRepositories.getEmployeeByEmail>).mockResolvedValue(mockEmployee as any);

    await expect(employeeServices.verifyEmployee("brian@company.com", "987654"))
      .rejects
      .toThrow("Invalid verification code");
  });

  it("should throw error when employee not found during verification", async () => {
    (employeeRepositories.getEmployeeByEmail as jest.MockedFunction<typeof employeeRepositories.getEmployeeByEmail>).mockResolvedValue(null);

    await expect(employeeServices.verifyEmployee("nonexistent@company.com", "123456"))
      .rejects
      .toThrow("Employee not found");
  });

  // loginEmployee
  it("should return token and employee info when login is successful", async () => {
    const mockEmployee = {
      employee_id: 1,
      first_name: "Mark",
      last_name: "Too",
      email: "mark@company.com",
      hashed_pass: "hashedPass",
      department_id: 1,
      role: "employee",
      is_active: true,
      date_joined: new Date('2023-01-01'),
    };

    (employeeRepositories.getEmployeeByEmail as jest.MockedFunction<typeof employeeRepositories.getEmployeeByEmail>).mockResolvedValue(mockEmployee as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockJwtToken");

    const result = await employeeServices.loginEmployee("mark@company.com", "password123");

    expect(employeeRepositories.getEmployeeByEmail).toHaveBeenCalledWith("mark@company.com");
    expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPass");
    expect(jwt.sign).toHaveBeenCalled();
    expect(result).toHaveProperty("token", "mockJwtToken");
    expect(result.message).toBe("Login successfully");
    expect(result.employee.email).toBe("mark@company.com");
  });

  it("should throw error when employee not found during login", async () => {
    (employeeRepositories.getEmployeeByEmail as jest.MockedFunction<typeof employeeRepositories.getEmployeeByEmail>).mockResolvedValue(null);

    await expect(employeeServices.loginEmployee("nonexistent@company.com", "password123"))
      .rejects
      .toThrow("Employee not found");
  });

  it("should throw error for invalid credentials", async () => {
    const mockEmployee = {
      employee_id: 1,
      first_name: "Mark",
      last_name: "Too",
      email: "mark@company.com",
      hashed_pass: "hashedPass",
      department_id: 1,
      role: "employee",
      is_active: true,
      date_joined: new Date('2023-01-01'),
    };

    (employeeRepositories.getEmployeeByEmail as jest.MockedFunction<typeof employeeRepositories.getEmployeeByEmail>).mockResolvedValue(mockEmployee as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(employeeServices.loginEmployee("mark@company.com", "wrongpassword"))
      .rejects
      .toThrow("Invalid credentials");
  });

  // updateEmployee
  it("should update employee after hashing password", async () => {
    const mockEmployee = { employee_id: 1, first_name: "John" };

    (employeeRepositories.getEmployeeById as jest.MockedFunction<typeof employeeRepositories.getEmployeeById>).mockResolvedValue(mockEmployee as any);
    (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");
    (employeeRepositories.UpdateEmploye as jest.MockedFunction<typeof employeeRepositories.UpdateEmploye>).mockResolvedValue({ message: "Employee updated successfully" });

    const result = await employeeServices.updateEmployee(1, { hashed_pass: "newpassword123" } as any);

    expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
    expect(employeeRepositories.UpdateEmploye).toHaveBeenCalled();
    expect(result).toEqual({ message: "Employee updated successfully" });
  });

  it("should throw error when updating non-existent employee", async () => {
    (employeeRepositories.getEmployeeById as jest.MockedFunction<typeof employeeRepositories.getEmployeeById>).mockResolvedValue(null as any);

    await expect(employeeServices.updateEmployee(999, { first_name: "Test" } as any))
      .rejects
      .toThrow("Employee not found");
  });

  // deleteEmployee
  it("should delete employee if exists", async () => {
    const mockEmployee = { employee_id: 1, first_name: "John" };

    (employeeRepositories.getEmployeeById as jest.MockedFunction<typeof employeeRepositories.getEmployeeById>).mockResolvedValue(mockEmployee as any);
    (employeeRepositories.deleteEmployee as jest.MockedFunction<typeof employeeRepositories.deleteEmployee>).mockResolvedValue({ message: "Employee deleted successfully" });

    const result = await employeeServices.deleteEmployee(1);

    expect(employeeRepositories.getEmployeeById).toHaveBeenCalledWith(1);
    expect(employeeRepositories.deleteEmployee).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: "Employee deleted successfully" });
  });

  it("should throw error when deleting non-existent employee", async () => {
    (employeeRepositories.getEmployeeById as jest.MockedFunction<typeof employeeRepositories.getEmployeeById>).mockResolvedValue(null as any);

    await expect(employeeServices.deleteEmployee(999))
      .rejects
      .toThrow("Employee not found");
  });

  // getEmployeeById
  it("should return employee by ID", async () => {
    const mockEmployee = {
      employee_id: 1,
      first_name: "Alice",
      last_name: "Mwangi",
      email: "alice@company.com",
    };

    (employeeRepositories.getEmployeeById as jest.MockedFunction<typeof employeeRepositories.getEmployeeById>).mockResolvedValue(mockEmployee as any);

    const result = await employeeServices.getEmployeeById(1);

    expect(employeeRepositories.getEmployeeById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockEmployee);
  });
});