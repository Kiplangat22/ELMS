import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { getPool } from './db/config';
import app from './index';  // your Express app

dotenv.config();

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

// Create a server using the Express app
const server = createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

getPool()
  .then(() => console.log("Database connected"))
  .catch((err: any) => console.log("Database connection failed: ", err));
