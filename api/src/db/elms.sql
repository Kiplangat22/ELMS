-- Select the database
USE [ELMS.dbs];
GO
-- DEPARTMENTS TABLE
CREATE TABLE Departments (
    department_id INT IDENTITY(1,1) PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL
);
-- EMPLOYEES TABLE
CREATE TABLE Employees (
    employee_id INT IDENTITY(1,1) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_pass VARCHAR(250) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    date_joined DATE,
    is_active BIT DEFAULT 1,
    department_id INT,
    verification_code VARCHAR(10),
    is_verified BIT DEFAULT 0
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- ALTER TABLE Employees
-- ADD verification_code VARCHAR(10),
--     is_verified BIT DEFAULT 0;

-- LEAVE_TYPE TABLE
CREATE TABLE Leave_Type (
    leave_type_id INT IDENTITY(1,1) PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL,
    description TEXT,
    default_days INT,
    created_at DATETIME DEFAULT GETDATE()
);

-- LEAVE_REQUEST TABLE
CREATE TABLE Leave_Request (
    request_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    total_days DECIMAL(4,1),
    justification TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    requested_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (leave_type_id) REFERENCES Leave_Type(leave_type_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- LEAVE_BALANCE TABLE
CREATE TABLE Leave_Balance (
    balance_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    balance_days DECIMAL(4,1) DEFAULT 0,
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- NOTIFICATION TABLE
CREATE TABLE Notification (
    notification_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NULL,
    request_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
        ON DELETE NO ACTION ON UPDATE NO ACTION,  -- Changed this
    FOREIGN KEY (request_id) REFERENCES Leave_Request(request_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

--POPULATING THE TABLES 
-- Inserting samples to department table
INSERT INTO Departments (department_name) VALUES
('Human Resources'),
('Finance'),
('Marketing'),
('IT Support'),
('Legal'),
('Operations'),
('Customer Service'),
('Research & Development');
-- Inserting sample leave types
INSERT INTO Leave_Type (type_name, description, default_days) VALUES
('Vacation', 'Paid time off for personal relaxation and leisure.', 15),
('Sick Leave', 'Time off for illness or medical appointments.', 10),
('Maternity/Paternity Leave', 'Leave for new parents to care for their newborn.', 30),
('Bereavement Leave', 'Time off to grieve the loss of a loved one.', 5),
('Unpaid Leave', 'Leave without pay for personal reasons.', 0);
-- Inserting  
INSERT INTO Employees (first_name, last_name, email, hashed_pass, role, date_joined, is_active, department_id)
VALUES 
('Admin', 'User', 'admin@example.com', 'hashed_password', 'admin', GETDATE(), 1, 1),  
('wyclif', 'macha', 'wyclif.macha@example.com', 'mypass', 'manager', GETDATE(), 1, 2),
('joshua', 'kamotho', 'joshua.kamotho@example.com', 'mypass', 'user', GETDATE(), 1, 3),
('edwin', 'mwangi', 'edwin.mwangi@example.com', 'mypass', 'user', GETDATE(), 1, 4),
('mary', 'nyambu', 'mary.nyambu@example.com', 'mypass', 'user', GETDATE(), 1, 3)

-- Inserting sample leave requests 
INSERT INTO Leave_Request (employee_id, leave_type_id, start_date, end_date, total_days, justification, status, requested_at) VALUES
(1, 1, '2024-07-01', '2024-07-10', 10.0, 'Family vacation', 'pending', GETDATE()),
(1, 2, '2024-08-05', '2024-08-07', 3.0, 'Medical reasons', 'Pending', GETDATE()),
(2, 1, '2024-07-07', '2024-07-10', 10.0, 'Family vacation', 'pending', GETDATE()),
(2, 2, '2024-09-05', '2024-08-07', 3.0, 'school', 'Pending', GETDATE()),
(3, 2, '2024-09-05', '2024-08-07', 3.0, 'Maternity', 'Pending', GETDATE());

-- Inserting sample leave balances
INSERT INTO Leave_Balance (employee_id, balance_days) VALUES
(1, 11.0),
(2, 10.0),
(3, 18.0),
(4, 0.0),
(4, 7.0),
(3, 5.0),
(2, 12.0)
-- Inserting sample notifications
INSERT INTO Notification (employee_id, request_id, message) VALUES
(1, 1, 'Your leave request for Annual Leave is pending approval.'),
(2, 2, 'Your Sick Leave request has been approved.'),
(3, 3, 'Your Compassionate Leave request is under review.'),
(4, 4, 'Your Maternity Leave has been /.'),
(5, 5, 'Your Paternity Leave request is pending.')

--selecting 
SELECT * FROM Employees;
-- SELECT * FROM Departments;  
SELECT * FROM Leave_Type;
-- SELECT * FROM Leave_Request;
-- SELECT * FROM Leave_Balance;
-- SELECT * FROM Notification;
-- GO
-- -- Dropping tables if they exist
-- DROP TABLE IF EXISTS Notification;
-- DROP TABLE IF EXISTS Leave_Balance;
--  DROP TABLE IF EXISTS Leave_Request;
-- DROP TABLE IF EXISTS Leave_Type;
-- DROP TABLE IF EXISTS Employees;
-- DROP TABLE IF EXISTS Departments;
-- GO


SELECT lb.*, e.first_name, e.last_name, e.email, d.department_name
FROM Leave_Balance lb
INNER JOIN Employees e ON lb.employee_id = e.employee_id
LEFT JOIN Departments d ON e.department_id = d.department_id
ORDER BY e.last_name, e.first_name;

