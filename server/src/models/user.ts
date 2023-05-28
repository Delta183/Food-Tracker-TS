import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    // unique ensures there is only one copy like so
    email: { type: String, required: true, unique: true, select: false }, 
    password: { type: String, required: true, select: false },
    // select makes it so when we retrieve a user from the database, the email and password won't
    // be returned naturally, it must be explicity requested.
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);