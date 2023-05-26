// import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";

// These parameters allow us to call it much like a fetch function
async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
} // There is no export for this function as we will use it in this file

// We write Promise<Note[]> as a safeguard
export async function fetchNotes(): Promise<Note[]> {
    const response = await fetchData("/api/notes", { method: "GET" });
    return response.json();
}

// Node creation below
export interface NoteInput {
    title: string,
    text?: string,
}

export async function createNote(note: NoteInput): Promise<Note> {
    const response = await fetchData("/api/notes",
        {
            // POST as we putting these values to the MongoDB
            method: "POST",
            // The header denotes the format the data will be in
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
        });
    return response.json();
}

export async function deleteNote(noteId: string) {
    // We add the id here to match the route in the server file as well as the id for which to delete
    await fetchData("/api/notes/" + noteId, { method: "DELETE" });
}