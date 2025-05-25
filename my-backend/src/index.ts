import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/users'; // Import user routes
import dotenv from 'dotenv';
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount user routes under /api
app.use('/api', userRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

// Basic error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});