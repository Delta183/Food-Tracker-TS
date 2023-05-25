import NoteModel from "../models/note"
import { RequestHandler } from "express";

// export const is used to export multiple things 
// When this was initially moved here, req, res and next produced errors as they don't have a type
// However, providing a type to the function itself allows the params to infer their type
export const getNotes : RequestHandler = async (req, res, next) => {
    try {
        // throw Error("Bazinga!")
        // Get the notes from our database
        // execute the find function to get all NoteModels in the database
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes); 
    } catch (error) {
       next(error);
    }
};

export const getNote: RequestHandler = async (req, res, next) => {
    // Referencing the variable in the router such that it can be read 
    const noteId = req.params.noteId;

    try {
        const note = await NoteModel.findById(noteId).exec();
        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

export const createNote: RequestHandler = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    try {
        // provided the title and text, we create a new NoteModel object
        const newNote = await NoteModel.create({
            title: title,
            text: text,
        });
        // Send the new note back as a JSON object
        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
};
