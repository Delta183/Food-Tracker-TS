import mongoose from "mongoose";

declare module "express-session" {
    interface SessionData {
        // Thesea are the available attributes during a session for a user
        userId: mongoose.Types.ObjectId;
    }
}