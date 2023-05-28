import { RequestHandler } from "express";
import createHttpError from "http-errors";

// middleware for getting the authorization of the user
export const requiresAuth: RequestHandler = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        next(createHttpError(401, "User not authenticated"));
    }
};