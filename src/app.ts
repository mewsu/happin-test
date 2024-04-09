// Define models

import express, { Express, Request, Response } from "express";
const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");


// Middleware to parse JSON bodies
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', bookRoutes);
app.use('/api', authorRoutes);

// Example route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
