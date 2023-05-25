import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes"
// There was a type error here, sometimes imports in TS result in this, try the command given or make a d.ts file
import morgan from "morgan"

const app = express();

app.use(morgan("dev"))

// Sets up express such that it can accept JSON bodies
app.use(express.json());

// Endpoints
app.use("/api/notes", notesRoutes)

// For requests for routers in which we have no endpoint for
app.use((req, res, next) => {
    next(Error("Endpoint not found"));
});

// Error handlers are a form of middleware of their own
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    // Code block to catch error and pass it accordingly that every endpoint should have for safety
    console.error(error);
    let errorMessage = "An unknown error occurred!";
    if (error instanceof Error) errorMessage = error.message;
    // use {} to define JSON
    res.status(500).json({error: errorMessage})
});
export default app;