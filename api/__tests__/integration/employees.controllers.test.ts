// import request from "supertest";
// import { expect, beforeAll, afterAll, describe, it } from "@jest/globals";
// import app from "../../src/index";
// import { getPool } from "../../src/db/config";

// // NOTE: Update these API routes to match your actual Express routes
// // Common patterns: /api/employees, /employees, /api/v1/employees
// let pool: any;

// const insertEmployee = async (
//   firstName: string,
//   lastName: string,
//   email: string,
//   phone: string,
//   password: string = "test123"
// ) => {
//   const result = await pool
//     .request()
//     .input("first_name", firstName)
//     .input("last_name", lastName)
//     .input("email", email)
//     .input("phone", phone)
//     .input("hashed_pass", password)
//     .query(`
//       INSERT INTO Employees (first_name, last_name, email, phone, hashed_pass)
//       OUTPUT INSERTED.employee_id
//       VALUES (@first_name, @last_name, @email, @phone, @hashed_pass);
//     `);
//   return result.recordset[0].employee_id;
// };

// beforeAll(async () => {
//   pool = await getPool();
// });

// afterAll(async () => {
//   await pool
//     .request()
//     .query("DELETE FROM Employees WHERE email LIKE 'test%@test.com'");

//   await pool.close();
// });

// describe("Employee API Integration Tests", () => {
//   it("should create a new employee successfully", async () => {
//     const employeeData = {
//       first_name: "Test",
//       last_name: "User",
//       email: "test-create@test.com",
//       phone: "1234567890",
//       hashed_pass: "password123",
//     };

//     const res = await request(app)
//       .post("/addEmployees")
//       .send(employeeData);

//     expect(res.status).toBe(201);
//   });

//   it("should fetch all employees successfully", async () => {
//     const res = await request(app).get("/getAllEmployees");
//     expect(res.status).toBe(200);
//   });

//   it("should fetch an employee by ID", async () => {
//     const employeeId = await insertEmployee(
//       "Test",
//       "GetById",
//       "test-getbyid@test.com",
//       "1234567890"
//     );
//     const res = await request(app).get(`/getEmployeeById/${employeeId}`);

//     expect(res.status).toBe(200);
//     expect(res.body.email).toMatch(/test-getbyid@test.com/i);
//   });

//   it("should update an employee successfully", async () => {
//     const employeeId = await insertEmployee(
//       "Test",
//       "Update",
//       "test-update@test.com",
//       "1234567890"
//     );
//     const res = await request(app)
//       .put(`/updateEmployee/${employeeId}`)
//       .send({
//         first_name: "Updated",
//         last_name: "Name",
//         email: "test-updated@test.com",
//         phone: "0987654321",
//       });

//     expect(res.status).toBe(200);
//   });

//   it("should delete an employee successfully", async () => {
//     const employeeId = await insertEmployee(
//       "Test",
//       "Delete",
//       "test-delete@test.com",
//       "1234567890"
//     );
//     const res = await request(app).delete(`/deleteEmployees/${employeeId}`);

//     expect(res.status).toBe(200);
//   });

//   it("should return 404 for non-existent employee ID", async () => {
//     const res = await request(app).get("/getEmployeeById/9999999");
//     expect(res.status).toBe(404);
//   });

//   it("should return 400 when updating with invalid ID", async () => {
//     const res = await request(app)
//       .put("/updateEmployee/abc")
//       .send({ first_name: "bad" });

//     expect(res.status).toBe(400);
//   });

//   it("should return 404 when updating non-existent employee", async () => {
//     const res = await request(app)
//       .put("/updateEmployee/999999")
//       .send({ first_name: "ghost" });

//     expect(res.status).toBe(404);
//   });

//   it("should return 400 for invalid ID on delete", async () => {
//     const res = await request(app).delete("/deleteEmployees/abc");
//     expect(res.status).toBe(400);
//   });

//   it("should return 401 for non-existent employee on delete", async () => {
//     const res = await request(app).delete("/deleteEmployees/9999999");
//     expect(res.status).toBe(401);
//   });

//   it("should login an employee with valid credentials", async () => {
//     const employeeId = await insertEmployee(
//       "Test",
//       "Login",
//       "test-login@test.com",
//       "1234567890",
//       "password123"
//     );

//     const res = await request(app)
//       .post("/loginEmployee")
//       .send({
//         email: "test-login@test.com",
//         hashed_pass: "password123",
//       });

//     expect(res.status).toBe(200);
//   });

//   it("should return 404 for login with non-existent email", async () => {
//     const res = await request(app)
//       .post("/loginEmployee")
//       .send({
//         email: "nonexistent@test.com",
//         hashed_pass: "password123",
//       });

//     expect(res.status).toBe(404);
//   });

//   it("should return 401 for login with invalid credentials", async () => {
//     await insertEmployee(
//       "Test",
//       "InvalidLogin",
//       "test-invalid-login@test.com",
//       "1234567890",
//       "correctpassword"
//     );

//     const res = await request(app)
//       .post("/loginEmployee")
//       .send({
//         email: "test-invalid-login@test.com",
//         hashed_pass: "wrongpassword",
//       });

//     expect(res.status).toBe(401);
//   });

//   it("should verify an employee with valid code", async () => {
//     const res = await request(app)
//       .post("/verifyEmployee")
//       .send({
//         email: "test-verify@test.com",
//         code: "123456",
//       });

//     expect([200, 400]).toContain(res.status);
//   });

//   it("should return 400 for verification without email", async () => {
//     const res = await request(app)
//       .post("/verifyEmployee")
//       .send({
//         code: "123456",
//       });

//     expect(res.status).toBe(400);
//   });

//   it("should return 400 for verification without code", async () => {
//     const res = await request(app)
//       .post("/verifyEmployee")
//       .send({
//         email: "test-verify@test.com",
//       });

//     expect(res.status).toBe(400);
//   });
// });