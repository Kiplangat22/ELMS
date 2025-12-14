import * as employessRepositories from "../repositories/employees.repositories";
import { NewEmployee, UpdateEmployee } from "../types/employess.types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { sendEmail } from "../mailer/mailers";
import { emailTemplate } from "../mailer/email_templates";

dotenv.config();

/* ================= CREATE EMPLOYEE ================= */
export const createEmployee = async (employee: NewEmployee) => {
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  await employessRepositories.createEmployee(employee);
  await employessRepositories.setVerificationCode(employee.email, verificationCode);

  await sendEmail(
    employee.email,
    "Welcome to ELMS",
    emailTemplate.welcome(employee.first_name)
  );

  await sendEmail(
    employee.email,
    "Verify your ELMS account",
    emailTemplate.verify(employee.first_name, verificationCode)
  );

  return { message: "Employee created. Verification code sent." };
};

/* ================= LIST EMPLOYEES ================= */
export const listEmployee = async () => {
  return await employessRepositories.getEmployee();
};

/* ================= GET BY ID ================= */
export const getEmployeeById = async (id: number) => {
  return await employessRepositories.getEmployeeById(id);
};

/* ================= UPDATE ================= */
export const updateEmployee = async (id: number, employee: UpdateEmployee) => {
  await ensureEmployeeExists(id);

  if (employee.hashed_pass) {
    employee.hashed_pass = await bcrypt.hash(employee.hashed_pass, 10);
  }

  return await employessRepositories.UpdateEmploye(id, employee);
};

/* ================= DELETE ================= */
export const deleteEmployee = async (id: number) => {
  await ensureEmployeeExists(id);
  return await employessRepositories.deleteEmployee(id);
};

/* ================= LOGIN (ACCESS + REFRESH TOKEN) ================= */
export const loginEmployee = async (email: string, password: string) => {
  const employee = await employessRepositories.getEmployeeByEmail(email);
  if (!employee) throw new Error("Employee not found");

  const isMatch = await bcrypt.compare(password, employee.hashed_pass);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = jwt.sign(
    {
      employee_id: employee.employee_id,
      email: employee.email,
      role: employee.role,
      first_name: employee.first_name,
      last_name: employee.last_name,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { employee_id: employee.employee_id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: employee.employee_id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      role: employee.role,
    },
  };
};

/* ================= VERIFY ================= */
export const verifyEmployee = async (email: string, code: string) => {
  const employee = await employessRepositories.getEmployeeByEmail(email);
  if (!employee) throw new Error("Employee not found");

  if (employee.verification_code !== code) {
    throw new Error("Invalid verification code");
  }

  await employessRepositories.verifyEmployee(email);

  await sendEmail(
    employee.email,
    "ELMS Verification Successful",
    emailTemplate.verifiedSuccess(employee.first_name)
  );

  return { message: "Employee verified successfully" };
};

/* ================= HELPER ================= */
const ensureEmployeeExists = async (id: number) => {
  const emp = await employessRepositories.getEmployeeById(id);
  if (!emp) throw new Error("Employee not found");
};
