import { getPool } from "../db/config";
import sql from "mssql";

// READ - Get all departments
export const getDepartmentsService = async () => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM Departments");
  return result.recordset;
};

// CREATE - Add a new department
export const createDepartmentService = async (department_name: string) => {
  const pool = await getPool();
  await pool
    .request()
    .input("department_name", sql.VarChar, department_name)
    .query("INSERT INTO Departments (department_name) VALUES (@department_name)");
};

// UPDATE - Modify an existing department
export const updateDepartmentService = async (id: number, department_name: string) => {
  const pool = await getPool();
  await pool
    .request()
    .input("department_id", sql.Int, id)
    .input("department_name", sql.VarChar, department_name)
    .query(
      "UPDATE Departments SET department_name = @department_name WHERE department_id = @department_id"
    );
};

// DELETE - Remove a department
export const deleteDepartmentService = async (id: number) => {
  const pool = await getPool();
  await pool
    .request()
    .input("department_id", sql.Int, id)
    .query("DELETE FROM Departments WHERE department_id = @department_id");
};
