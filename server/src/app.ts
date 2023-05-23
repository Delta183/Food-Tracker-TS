import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";

import NoteModel from "./models/note"
const app = express();

// Endpoints
// request, response and next
app.get("/", async (req, res, next) => {
    try {
        // throw Error("Bazinga!")
        // Get the notes from our database
        // execute the find function to get all NoteModels in the database
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes); 
    } catch (error) {
       next(error);
    }
});

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