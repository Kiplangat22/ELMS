import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { logger } from './middleware/loggers'

import employeesRoutes from './routers/employees.routes'
import departmentRoutes from './routers/department.routes'
import leaveBalanceRoutes from './routers/leave_balance.routes'
import LeaveTypeRoutes from './routers/leave_types.routes'
import LeaveRequestRoutes from './routers/leave_request.routes'
import notificationRouter from './routers/notification.routes'

dotenv.config()

const initializeApp = () => {
    const app = express()

    app.use(logger)
    app.use(cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }))

    app.use(express.json())


    // Routes using Router()
    app.use('/api/departments', departmentRoutes)
    app.use('/api/leave-types', LeaveTypeRoutes)
    app.use('/api/leave-balances', leaveBalanceRoutes)
    app.use('/api/leave-requests', LeaveRequestRoutes)

   
    employeesRoutes(app)
    notificationRouter(app)

    // Root route
    app.get('/', (_, res) => {
        res.send("Welcome to the Employee Leave Management System API")
    })

    return app
}

const app = initializeApp()
export default app
