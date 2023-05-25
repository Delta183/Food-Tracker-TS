import express from "express";
import * as NotesController from "../controllers/notes"

// We set endpoints on this router and pass it to the main express object
const router = express.Router();

// Separate the endpoints and the logic of them into two files.
// We also don't put parenthesis on the getNotes function as we are passing the function in this case but not calling it
router.get("/", NotesController.getNotes);
router.get("/:noteId", NotesController.getNote);
router.post("/", NotesController.createNote);

export default router;