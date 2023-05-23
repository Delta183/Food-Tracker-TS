import { InferSchemaType, model, Schema } from "mongoose";

// The Schema resembles a class with attributes
const noteSchema = new Schema({
    // userId: { type: Schema.Types.ObjectId, required: true }, // required is true akin to a DB
    title: { type: String, required: true },
    text: { type: String },
}, { timestamps: true });

// This is for type safety and code completion pertinent to the type
type Note = InferSchemaType<typeof noteSchema>;

// This is pertinent to the use of the schema as an object
export default model<Note>("Note", noteSchema);