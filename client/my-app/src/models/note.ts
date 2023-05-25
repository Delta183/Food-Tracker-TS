export interface Note {
    _id: string,
    title: string,
    text?: string,
    createdAt: string,
    updatedAt: string,
}
// Since these are the frontend counterpart of the MongoDB ones, the attributes must be exactly the same
// This was exactly how Alex did it and the standard for interfaces in TS (not with MongoDB)