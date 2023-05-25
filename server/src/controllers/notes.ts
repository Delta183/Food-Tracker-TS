import NoteModel from "../models/note"
import mongoose from "mongoose";
import { RequestHandler } from "express";
import createHttpError from "http-errors";

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
        // Check if the given noteId adheres to the structures of ids
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        // Provided a valid id, check if the note fetched is null/does not exist
        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

// These are akin to types, acting like objects to make req.body.title less ambiguous
// Prior to this, the error handling here was not optimal and even missing/entering the title
// incorrectly would lead to errors
interface CreateNoteBody {
    title?: string,
    text?: string,
}

// We pass unknown instead of any because the latter is too unrestricted and ambiguous. 
// unknown has a greater degree of restriction
export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    try {
        // Ensure the title is there for the notes
        if (!title) {
            throw createHttpError(400, "Note must have a title");
        }
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
