import { getPool } from "../db/config";
import sql from "mssql";

// READ - Get all departments
export const getAllDepartments = async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM Departments");
    return result.recordset;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

// CREATE - Add a new department
export const createDepartmentRepo = async (department_name: string) => {
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("department_name", sql.VarChar, department_name)
      .query("INSERT INTO Departments (department_name) VALUES (@department_name)");
  } catch (error) {
    console.error("Error creating department:", error);
    throw error;
  }
};

// UPDATE - Modify an existing department
export const updateDepartmentRepo = async (department_id: number, department_name: string) => {
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("department_id", sql.Int, department_id)
      .input("department_names", sql.VarChar, department_name)
      .query(
        "UPDATE Departments SET department_name = @department_name WHERE department_id = @department_id"
      );
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};

// DELETE - Remove a department
export const deleteDepartmentRepo = async (department_id: number) => {
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("department_id", sql.Int, department_id)
      .query("DELETE FROM Departments WHERE department_id = @department_id");
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};
