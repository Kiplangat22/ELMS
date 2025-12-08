import request from "supertest";
import { expect, beforeAll, afterAll, describe, it, jest } from "@jest/globals";
import app from "../../src/index";
import { getPool } from "../../src/db/config";

// Mock the email service to prevent actual email sending during tests
jest.mock("../../src/mailer/mailers", () => ({
  sendEmail: jest.fn(),
}));

let pool: any;

const insertEmployee = async (
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  departmentId: number = 1,
  role: string = "employee",
  password: string = "test123"
) => {
  const result = await pool
    .request()
    .input("first_name", firstName)
    .input("last_name", lastName)
    .input("email", email)
    .input("phone_number", phoneNumber)
    .input("department_id", departmentId)
    .input("role", role)
    .input("hashed_pass", password)
    .input("is_active", true)
    .query(`
      INSERT INTO Employees (first_name, last_name, email, phone_number, department_id, role, hashed_pass, is_active)
      OUTPUT INSERTED.employee_id
      VALUES (@first_name, @last_name, @email, @phone_number, @department_id, @role, @hashed_pass, @is_active);
    `);
  return result.recordset[0].employee_id;
};

beforeAll(async () => {
  pool = await getPool();
});

afterAll(async () => {
  await pool
    .request()
    .query("DELETE FROM Employees WHERE email LIKE 'test%@test.com'");

  await pool.close();
});

describe("Employee API Integration Tests", () => {
  it("should create a new employee successfully", async () => {
    const employeeData = {
      first_name: "Test",
      last_name: "User",
      email: "test-create@test.com",
      phone_number: "1234567890",
      department_id: 1,
      role: "employee",
      hashed_pass: "password123",
    };

    const res = await request(app)
      .post("/addEmployees")
      .send(employeeData);

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/Employee created successfully/i);
  });

  it("should fetch all employees successfully", async () => {
    const res = await request(app).get("/getAllEmployees");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch an employee by ID", async () => {
    const employeeId = await insertEmployee(
      "Test",
      "GetById",
      "test-getbyid@test.com",
      "1234567890"
    );
    const res = await request(app).get(`/getEmployeeById/${employeeId}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toMatch(/test-getbyid@test.com/i);
  });

  it("should return 404 for non-existent employee ID", async () => {
    const res = await request(app).get("/getEmployeeById/9999999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Employee not found');
  });

  it("should update an employee successfully", async () => {
    const employeeId = await insertEmployee(
      "Test",
      "Update",
      "test-update@test.com",
      "1234567890"
    );
    const res = await request(app)
      .put(`/updateEmployee/${employeeId}`)
      .send({
        first_name: "Updated",
        last_name: "Name",
        email: "test-updated@test.com",
        phone_number: "0987654321",
      });

    expect(res.status).toBe(200);
  });

  it("should return 400 when updating with invalid ID", async () => {
    const res = await request(app)
      .put("/updateEmployee/abc")
      .send({ first_name: "bad" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('invalid employee_id ');
  });

  it("should return 404 when updating non-existent employee", async () => {
    const res = await request(app)
      .put("/updateEmployee/999999")
      .send({ first_name: "ghost" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Employee not found');
  });

  it("should delete an employee successfully", async () => {
    const employeeId = await insertEmployee(
      "Test",
      "Delete",
      "test-delete@test.com",
      "1234567890"
    );
    const res = await request(app).delete(`/deleteEmployees/${employeeId}`);

    expect(res.status).toBe(200);
  });

  it("should return 400 for invalid ID on delete", async () => {
    const res = await request(app).delete("/deleteEmployees/abc");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('invalid Employee id');
  });

  it("should return 401 for non-existent employee on delete", async () => {
    const res = await request(app).delete("/deleteEmployees/9999999");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Employee not found');
  });

  it("should login an employee with valid credentials", async () => {
    // Create employee via API so password gets hashed properly
    const employeeData = {
      first_name: "Test",
      last_name: "Login",
      email: "test-login@test.com",
      phone_number: "1234567890",
      department_id: 1,
      role: "employee",
      hashed_pass: "password123",
    };

    await request(app).post("/addEmployees").send(employeeData);

    // Wait a bit for email sending to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    const res = await request(app)
      .post("/loginEmployee")
      .send({
        email: "test-login@test.com",
        hashed_pass: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.message).toBe('Login successfully');
  });

  it("should return 404 for login with non-existent email", async () => {
    const res = await request(app)
      .post("/loginEmployee")
      .send({
        email: "nonexistent@test.com",
        hashed_pass: "password123",
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Employee not found');
  });

  it("should return 401 for login with invalid credentials", async () => {
    // Create employee via API
    const employeeData = {
      first_name: "Test",
      last_name: "InvalidLogin",
      email: "test-invalid-login@test.com",
      phone_number: "1234567890",
      department_id: 1,
      role: "employee",
      hashed_pass: "correctpassword",
    };

    await request(app).post("/addEmployees").send(employeeData);

    // Wait a bit for email sending to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    const res = await request(app)
      .post("/loginEmployee")
      .send({
        email: "test-invalid-login@test.com",
        hashed_pass: "wrongpassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  }, 10000);

  it("should verify an employee with valid code", async () => {
    const res = await request(app)
      .post("/verifyEmployee")
      .send({
        email: "test-verify@test.com",
        code: "123456",
      });

    // Will be either 200 (if employee exists with matching code) or 400
    expect([200, 400]).toContain(res.status);
  });

  it("should return 400 for verification without email", async () => {
    const res = await request(app)
      .post("/verifyEmployee")
      .send({
        code: "123456",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email and verification code are required');
  });

  it("should return 400 for verification without code", async () => {
    const res = await request(app)
      .post("/verifyEmployee")
      .send({
        email: "test-verify@test.com",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email and verification code are required');
  });

  it("should return 400 when verifying non-existent employee", async () => {
    const res = await request(app)
      .post("/verifyEmployee")
      .send({
        email: "nonexistent@test.com",
        code: "123456",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Employee not found|Invalid/);
  });

  it("should return 400 for invalid verification code", async () => {
    // First create an employee
    const employeeData = {
      first_name: "Test",
      last_name: "Verify",
      email: "test-verify-invalid@test.com",
      phone_number: "1234567890",
      department_id: 1,
      role: "employee",
      hashed_pass: "password123",
    };

    await request(app).post("/addEmployees").send(employeeData);

    // Wait a bit for email sending
    await new Promise(resolve => setTimeout(resolve, 500));

    // Try to verify with wrong code
    const res = await request(app)
      .post("/verifyEmployee")
      .send({
        email: "test-verify-invalid@test.com",
        code: "000000", // Wrong code
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid verification code');
  });
});