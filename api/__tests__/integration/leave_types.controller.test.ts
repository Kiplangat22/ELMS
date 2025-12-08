import request from "supertest";
import { expect, beforeAll, afterAll, describe, it } from "@jest/globals";
import app from "../../src/index";
import { getPool } from "../../src/db/config";

let pool: any;

const insertLeaveType = async (typeName: string, defaultDays: number) => {
  const result = await pool
    .request()
    .input("type_name", typeName)
    .input("description", "Test description")
    .input("default_days", defaultDays)
    .query(`
      INSERT INTO Leave_Type (type_name, description, default_days)
      OUTPUT INSERTED.leave_type_id
      VALUES (@type_name, @description, @default_days);
    `);
  return result.recordset[0].leave_type_id;
};

beforeAll(async () => {
  pool = await getPool();
});

afterAll(async () => {
  await pool
    .request()
    .query("DELETE FROM Leave_Type WHERE type_name LIKE 'test%'");

  await pool.close();
});

describe("Leave Type API Integration Tests", () => {
  it("should create a new leave type successfully", async () => {
    const leaveTypeData = {
      type_name: "test-Annual Leave",
      description: "integration test",
      default_days: 21,
    };

    const res = await request(app)
      .post("/api/leave-types")
      .send(leaveTypeData);

    expect(res.status).toBe(201);
  });

  it("should fetch all leave types successfully", async () => {
    const res = await request(app).get("/api/leave-types");
    expect(res.status).toBe(200);
  });

  it("should fetch a leave type by ID", async () => {
    const leaveTypeId = await insertLeaveType("test-getbyid-leave", 15);
    const res = await request(app).get(`/api/leave-types/${leaveTypeId}`);

    expect(res.status).toBe(200);
    expect(res.body.type_name).toMatch(/test-getbyid-leave/i);
  });

  it("should update a leave type successfully", async () => {
    const leaveTypeId = await insertLeaveType("test-update-leave", 10);
    const res = await request(app)
      .put(`/api/leave-types/${leaveTypeId}`)
      .send({
        type_name: "test-Updated Leave",
        description: "Updated description",
        default_days: 25,
      });

    expect(res.status).toBe(200);
  });

  it("should delete a leave type successfully", async () => {
    const leaveTypeId = await insertLeaveType("test-delete-leave", 5);
    const res = await request(app).delete(`/api/leave-types/${leaveTypeId}`);

    expect(res.status).toBe(200);
  });

  it("should return 404 for non-existent leave type ID", async () => {
    const res = await request(app).get("/api/leave-types/9999999");
    expect(res.status).toBe(404);
  });

  it("should return 404 when updating with invalid ID", async () => {
    const res = await request(app)
      .put("/api/leave-types/abc")
      .send({ type_name: "bad" });

    expect(res.status).toBe(404);
  });

  it("should return 404 when updating non-existent leave type", async () => {
    const res = await request(app)
      .put("/api/leave-types/999999")
      .send({ type_name: "ghost" });

    expect(res.status).toBe(404);
  });

  it("should return 404 for invalid ID on delete", async () => {
    const res = await request(app).delete("/api/leave-types/abc");
    expect(res.status).toBe(404);
  });

  it("should return 404 for non-existent leave type on delete", async () => {
    const res = await request(app).delete("/api/leave-types/9999999");
    expect(res.status).toBe(404);
  });
});
