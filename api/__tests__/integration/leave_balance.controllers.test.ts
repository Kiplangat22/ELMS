// import request from "supertest";
// import app from "../../src/index"; // your Express app
// import { expect, describe, it } from "@jest/globals";

// describe("Leave Balance API Integration Tests", () => {
//   let testEmployeeId = 1; // make sure this employee exists in your test DB
//   let testBalanceId: number;

//   it("should create an initial leave balance", async () => {
//     const res = await request(app)
//       .post("/api/leave-balances")
//       .send({
//         employee_id: testEmployeeId,
//         balance_days: 20,
//       });

//     expect(res.status).toBe(201);
//     expect(res.body.employee_id).toBe(testEmployeeId);
//     expect(res.body.balance_days).toBe(20);

//     testBalanceId = res.body.balance_id; // store for later tests
//   });

//   it("should fetch all leave balances", async () => {
//     const res = await request(app).get("/api/leave-balances");

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it("should fetch leave balance by employee ID", async () => {
//     const res = await request(app).get(`/api/leave-balances/${testEmployeeId}`);

//     expect(res.status).toBe(200);
//     expect(res.body.employee_id).toBe(testEmployeeId);
//   });

//   it("should update leave balance successfully", async () => {
//     const res = await request(app)
//       .put(`/api/leave-balances/${testBalanceId}`)
//       .send({ balance_days: 25 });

//     expect(res.status).toBe(200);
//     expect(res.body.balance_days).toBe(25);
//   });

//   it("should return 400 for invalid balance ID on update", async () => {
//     const res = await request(app)
//       .put("/api/leave-balances/abc")
//       .send({ balance_days: 25 });

//     expect(res.status).toBe(400);
//   });

//   it("should return 404 for non-existent balance on update", async () => {
//     const res = await request(app)
//       .put("/api/leave-balances/999999")
//       .send({ balance_days: 25 });

//     expect(res.status).toBe(404);
//   });

//   it("should delete leave balance successfully", async () => {
//     const res = await request(app).delete(`/api/leave-balances/${testBalanceId}`);

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe("Leave balance deleted successfully");
//   });

//   it("should return 400 for invalid balance ID on delete", async () => {
//     const res = await request(app).delete("/api/leave-balances/abc");

//     expect(res.status).toBe(400);
//   });

//   it("should return 404 for non-existent balance on delete", async () => {
//     const res = await request(app).delete("/api/leave-balances/999999");

//     expect(res.status).toBe(404);
//   });
// });
