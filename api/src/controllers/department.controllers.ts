import { Request, Response } from "express";
import { getPool } from "../db/config";
import {
  getDepartmentsService,
  createDepartmentService,
  updateDepartmentService,
  deleteDepartmentService,
} from "../services/department.services";

// GET all departments
export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await getDepartmentsService();
    res.status(200).json(departments);
  } catch (error: any) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  CREATE a new department
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const pool = await getPool();
    await pool
      .request()
      .input('name', name)
      .query('INSERT INTO Departments (department_name) VALUES (@name)');
    res.status(201).json({ message: 'Department created successfully' });
  } catch (err: any) {
    console.error('Error creating department:', err);
    res.status(500).json({ message: 'Error creating department', error: err.message });
  }
};

// GET department by ID
export const getDepartmentById = async (req: Request, res: Response) => {
  const { id } = req.params;

    if (!department_name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    try {
    await createDepartmentService(department_name);
    res.status(201).json({ message: "Department created successfully" });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE a department
export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { department_name } = req.body;

    if (!department_name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    await updateDepartmentService(parseInt(id), department_name);
    res.status(200).json({ message: "Department updated successfully" });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE a department
export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteDepartmentService(parseInt(id));
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
