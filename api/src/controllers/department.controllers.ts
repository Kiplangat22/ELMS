import { Request, Response } from "express";
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
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// CREATE department
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { department_name } = req.body;

    if (!department_name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    await createDepartmentService(department_name);
    res.status(201).json({ message: "Department created successfully" });
  } catch (error: any) {
    console.error("Error creating department:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET department by ID
// GET department by ID
export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deptId = parseInt(id);

    const departments = await getDepartmentsService();
    const department = departments.find((d: any) => d.id === deptId);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// UPDATE department
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

// DELETE department
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
